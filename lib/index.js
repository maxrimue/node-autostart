'use strict()';

var fs = require('fs'),
  exec = require('child_process').exec,
  os = require('os'),
  crontab = require('crontab'),
  username = require('username');

/**
 * Checks if given callback is a function, and if not, throws error
 * @param {Function} Callback
 * @param {String} Error (if existing)
 */
function callback(cb, err) {
  if(typeof(cb) === 'function') {
    cb(err);
  }
  else {
    return new Error(err);
  }
}

/**
 * Changes .autostart file in $HOME path
 * @param {Boolean} Autostart enabled? (If false = disabled)
 * @param {String} Key
 * @param {String} Path
 * @param {String} Command
 */
function modifyHomeFile(isEnabled, key, path, command) {
  var fileExists = true, content;

  try {
    fs.statSync((process.env.HOME || process.env.USERPROFILE) + '/.autostart.json');
  } catch (e) {
    fileExists = false;
  }

  if (isEnabled) {
    if (fileExists) {
      content = JSON.parse(fs.readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.autostart.json', 'utf-8'));
    } else {
      content = {};
    }
    content[key] = 'Path: ' + path + ', command: ' + command;
  } else {
    if (fileExists) {
      content = JSON.parse(fs.readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.autostart.json', 'utf-8'));
    } else {
      content = {};
    }
    delete content[key];
  }

  fs.writeFileSync((process.env.HOME || process.env.USERPROFILE) + '/.autostart.json', JSON.stringify(content), 'utf8');
}

/**
 * Returns the path for the startup folder in Windows
 * @returns {String} path
 */

function getWinStartupPath() {
  if (os.release().substring(2, 0).replace('.', '') >= 6) {
    return 'C:\\Users\\' + username.sync() + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup';
  } else {
    return 'C:\\Documents and Settings\\' + username.sync() + '\\Start Menu\\Programs\\Startup';
  }
}

/**
 * Enables autostart
 * @param {String} key
 * @param {String} command
 * @param {String} path
 * @param {Function} callback
 */

function enableAutostart(key, command, path, cb) {
  var err;

  if (!key || !command || !path || !callback) {
    return callback(cb, 'Not enough arguments passed to enableAutostart().'); // Here, callback() is used to check if a callback is given
  }

  else if (typeof(key) !== 'string') {
    return callback(cb, 'Passed "key" to enableAutostart() is not a string.');
  }

  else if (typeof(command) !== 'string') {
    return callback(cb, 'Passed "command" to enableAutostart() is not a string.');
  }

  else if (typeof(path) !== 'string') {
    return callback(cb, 'Passed "path" to enableAutostart() is not a string.');
  }

  else if (typeof(callback) !== 'function') {
    return callback(cb, 'Passed "callback" to enableAutostart() is not a function.');
  }

  isAutostartEnabled(key, function(isEnabled, error) {
    if (error) cb(err); // Here, we know we have a callback (cb), so we don't need callback(), and instead use the callback directly with cb()

    if (isEnabled) cb('Autostart already is enabled');

    if (os.platform() === 'darwin') {
      //Adding a service with the given key to launchd, by placing a launchd compatible .plist in the user's LaunchAgents folder
      var plistFileContent = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" \
      "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>' + key + '\
      </string><key>ProgramArguments</key><array><string>bash</string><string>-c</string><string>cd ' + path + ' && ' + command + '\
      </string></array><key>RunAtLoad</key><true/></dict></plist>';

      fs.writeFile('/Users/' + username.sync() + '/Library/LaunchAgents/' + key + '.plist', plistFileContent, function(error) {
        err = error;

        if (!err) modifyHomeFile(true, key, path, command);

        cb(err);
      });
    } else if (os.platform() === 'linux') {
      var linuxCommand = 'cd ' + path + ' && ' + command;
      crontab.create(linuxCommand, '@reboot', key);

      crontab.save(function(error) {
        err = error;

        if (!err) modifyHomeFile(true, key, path, command);

        cb(err);
      });
    } else if (os.platform() === 'win32') {
      var batchFileContent = 'cd ' + path + ' && ' + command; //File to be placed in the startup folder
      fs.writeFile(getWinStartupPath() + '/' + key + '.bat', batchFileContent, function(error) {
        err = error;

        if (!err) modifyHomeFile(true, key, path, command);

        cb(err);
      });
    }
  });
}

/**
 * Disables autostart
 * @param {String} key
 * @param {Function} callback
 */

function disableAutostart(key, cb) {
  var err;

  if (!key || !callback) {
    return callback(cb, 'Not enough arguments passed to disableAutostart()');
  }

  else if (typeof(key) !== 'string') {
    return callback(cb, 'Passed "key" to disableAutostart() is not a string.');
  }

  else if (typeof(callback) !== 'function') {
    return callback(cb, 'Passed "callback" to disableAutostart() is not a function.');
  }

  isAutostartEnabled(key, function(isEnabled, error) {
    if (error) cb(error);

    if (!isEnabled) cb('Autostart is not enabled, so you cannot disable it');

    if (os.platform() === "darwin") {
      //Removing the launchd .plist with the name of the passed key
      fs.unlink('/Users/' + username.sync() + '/Library/LaunchAgents/' + key + '.plist', function(error) {
        err = error;

        if (!err) modifyHomeFile(false, key);

        cb(err);
      });
    } else if (os.platform() === 'linux') {
      crontab.remove({comment: key});

      crontab.save(function(error) {
        err = error;

        if (!err) modifyHomeFile(false, key);

        cb(err);
      });
    } else if (os.platform() === 'win32') {
      fs.unlink(getWinStartupPath() + '/' + key + '.bat', function(error) {
        err = error;

        if (!err) modifyHomeFile(false, key);

        cb(err);
      });
    }
  });
}

/**
 * Checks if autostart is enabled
 * @param {String} key
 * @param {Function} callback
 */

function isAutostartEnabled(key, cb) {
  var err, isEnabled;

  if (!key || !callback) {
    return callback(cb, 'Not enough arguments passed to isAutostartEnabled()');
  }

  else if (typeof(key) !== 'string') {
    return callback(cb, 'Passed "key" to disableAutostart() is not a string.');
  }

  else if (typeof(callback) !== 'function') {
    return callback(cb, 'Passed "callback" to disableAutostart() is not a function.');
  }

  if (os.platform() === "darwin") {
    fs.stat('/Users/' + username.sync() + '/Library/LaunchAgents/' + key + '.plist', function(error, stat) {
      if (!error) {
        isEnabled = true;
      } else if (error.code === 'ENOENT') {
        isEnabled = false;
      } else {
        err = error;
      }

      cb(err, isEnabled);
    });
  } else if (os.platform() === "linux") {
    var tmpLoad = crontab.load; //Variable for temporarily saving crontab.load() as crontab.load() overwrites 'crontab'
    crontab.load(function(error, crontabData) {
      crontab = crontabData; //Make crontab's data globally available
      crontab.load = tmpLoad;

      if (crontab.jobs({comment: key}).length == '0') {
        isEnabled = false;
      } else {
        isEnabled = true;
      }

      cb(isEnabled, err);
    });
  } else if (os.platform() === "win32") {
    fs.stat(getWinStartupPath() + '/' + key + '.bat', function(error, stat) {
      if (!error) {
        isEnabled = true;
      } else if (error.code === 'ENOENT') {
        isEnabled = false;
      } else {
        err = error;
      }

      cb(isEnabled, err);
    });
  } else {
    cb(false, 'Your platform currently is not supported');
  }
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
