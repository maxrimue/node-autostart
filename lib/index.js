'use strict()';

var fs = require('fs'),
  exec = require('child_process').exec,
  os = require('os'),
  crontab = require('crontab'),
  username = require('username');

if (process.env.NODE_ENV === 'test') var test = true;

/**
 * Returns the path for the startup folder in Windows
 * @returns {String} path
 */
/* istanbul ignore next */
function getWinStartupPath() {
  var path;
  var majorRelease = os.release().substring(2, 0);
  majorRelease = majorRelease.replace('.', '');
  if (majorRelease >= 6) {
    path = 'C:\\Users\\' + username.sync() + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup';
  } else {
    path = 'C:\\Documents and Settings\\' + username.sync() + '\\Start Menu\\Programs\\Startup';
  }

  return path;
}

/**
 * Enables autostart
 * @param {String} key
 * @param {String} command
 * @param {String} path
 * @param {Function} callback
 */

function enableAutostart(key, command, path, callback) {
  var err = '';

  if (!key || !command || !path || !callback) {
    if (!test) console.error('Not enough arguments passed to node-autostart, enableAutostart().');
    return 1;
  }

  if (typeof(key) !== 'string') {
    if (!test) console.error('node-autostart: Passed "key" to enableAutostart() is not a string.');
    return 1;
  }

  if (typeof(command) !== 'string') {
    if (!test) console.error('node-autostart: Passed "command" to enableAutostart() is not a string.');
    return 1;
  }

  if (typeof(path) !== 'string') {
    if (!test) console.error('node-autostart: Passed "path" to enableAutostart() is not a string.');
    return 1;
  }

  if (typeof(callback) !== 'function') {
    if (!test) console.error('node-autostart: Passed "callback" to enableAutostart() is not a function.');
    return 1;
  }

  isAutostartEnabled(key, function(isEnabled, error) {
    /* istanbul ignore next */
    if (error !== null) {
      err = error;
      callback(err);
      return 1;
    }

    /* istanbul ignore next */
    if (isEnabled === true) {
      err = 'Autostart already is enabled';
      callback(err);
      return 1;
    }

    /* istanbul ignore next */
    if (os.platform() === 'darwin') {
      //Adding a service with the given key to launchd, by placing a launchd compatible .plist in the user's LaunchAgents folder
      /* istanbul ignore next */
      var plistFileContent = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" \
      "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>' + key + '\
      </string><key>ProgramArguments</key><array><string>bash</string><string>-c</string><string>cd ' + path + ' && ' + command + '\
      </string></array><key>RunAtLoad</key><true/></dict></plist>';

      fs.writeFile('/Users/' + username.sync() + '/Library/LaunchAgents/' + key + '.plist', plistFileContent, function(error) {
        err = error;

        if(err === '' || err === undefined) err = null;
        callback(err);
      });
    } /* istanbul ignore next */
    else if (os.platform() === 'linux') {
      var linuxCommand = 'cd ' + path + ' && ' + command;
      crontab.create(linuxCommand, '@reboot', key);

      crontab.save(function(error) {
        err = error;

        if (err === '' || err === undefined) err = null;
        callback(err);
      });
    } /* istanbul ignore next */
    else if (os.platform() === 'win32') {
      var batchFileContent; //File to be placed in the startup folder, will be generated here
      batchFileContent = 'cd ' + path + ' && ' + command;
      fs.writeFile(getWinStartupPath() + '/' + key + '.bat', batchFileContent, function(error) {
        err = error;

        if (err === '' || err === undefined) err = null;
        callback(err);
      });
    }
  });
}

/**
 * Disables autostart
 * @param {String} key
 * @param {Function} callback
 */

function disableAutostart(key, callback) {
  var err;

  if (!key || !callback) {
    if (!test) console.error('Not enough arguments passed to node-autostart, disableAutostart()');
    return 1;
  }

  if (typeof(key) !== 'string') {
    if (!test) console.error('node-autostart: Passed "key" to disableAutostart() is not a string.');
    return 1;
  }

  if (typeof(callback) !== 'function') {
    if (!test) console.error('node-autostart: Passed "callback" to disableAutostart() is not a function.');
    return 1;
  }

  isAutostartEnabled(key, function(isEnabled, error) {
    /* istanbul ignore next */
    if (error !== null) {
      err = error;
      callback(err);
      return 1;
    }

    /* istanbul ignore next */
    if (!isEnabled) {
      err = 'Autostart is not enabled, so you cannot disable it';
      callback(err);
      return 1;
    }

    /* istanbul ignore next */
    if (os.platform() === "darwin") {
      //Removing the launchd .plist with the name of the passed key
      /* istanbul ignore next */
      fs.unlink('/Users/' + username.sync() + '/Library/LaunchAgents/' + key + '.plist', function(error) {
        err = error;

        if (err === '' || err === undefined) err = null;
        callback(err);
      });
    } /* istanbul ignore next */
    else if (os.platform() === 'linux') {
      crontab.remove({comment:key});

      crontab.save(function(error) {
        err = error;

        if (err === '' || err === undefined) err = null;
        callback(err);
      });
    } /* istanbul ignore next */
    else if (os.platform() === 'win32') {
      fs.unlink(getWinStartupPath() + '/' + key + '.bat', function(error) {
        err = error;

        if (err === '' || err === undefined) err = null;
        callback(err);
      });
    }
  });
}

/**
 * Checks if autostart is enabled
 * @param {String} key
 * @param {Function} callback
 */

function isAutostartEnabled(key, callback) {
  var err;
  var isEnabled;

  if (!key || !callback) {
    if (!test) console.error('Not enough arguments passed to node-autostart, disableAutostart()');
    return 1;
  }

  if (typeof(key) !== 'string') {
    if (!test) console.error('node-autostart: Passed "key" to disableAutostart() is not a string.');
    return 1;
  }

  if (typeof(callback) !== 'function') {
    if (!test) console.error('node-autostart: Passed "callback" to disableAutostart() is not a function.');
    return 1;
  }

  /* istanbul ignore next */
  if (os.platform() === "darwin") {
    /* istanbul ignore next */
    fs.stat('/Users/' + username.sync() + '/Library/LaunchAgents/' + key + '.plist', function(error, stat) {
      if (error === null) {
        isEnabled = true;
      } else if (error.code === 'ENOENT') {
        isEnabled = false;
      } else {
        err = error;
      }

      if (err === '' || err === undefined) err = null;
      callback(isEnabled, err);
    });
  } /* istanbul ignore next */
  else if (os.platform() === "linux") {
    var tmpLoad = crontab.load; //Variable for temporarily saving crontab.load() as crontab.load() overwrites 'crontab'
    crontab.load(function(error, crontabData) {
      crontab = crontabData; //Make crontab's data globally available
      crontab.load = tmpLoad;

      if(crontab.jobs({comment:key}).length == '0') {
        isEnabled = false;
      }
      else {
        isEnabled = true;
      }

      if (err === '' || err === undefined) err = null;
      callback(isEnabled, err);
    });
  } /* istanbul ignore next */
  else if (os.platform() === "win32") {
    fs.stat(getWinStartupPath() + '/' + key + '.bat', function(error, stat) {
      if (error === null) {
        isEnabled = true;
      } else if (error.code === 'ENOENT') {
        isEnabled = false;
      } else {
        err = error;
      }

      if (err === '' || err === undefined) err = null;
      callback(isEnabled, err);
    });
  }
  /* istanbul ignore else */
  else {
    err = 'Your platform currently is not supported';
    callback(isEnabled = false, err);
  }
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
