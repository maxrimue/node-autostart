'use strict()';

const osName = process.platform;

var autostart = require('./lib/' + osName + '.js');

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
 * Enables autostart
 * @param {String} key
 * @param {String} command
 * @param {String} path
 * @param {Function} callback
 */

function enableAutostart(key, command, path, cb) {
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

  autostart.enableAutostart(key, command, path, function(err) {
    err ? cb(err) : modifyHomeFile(true, key, command, path);
  });
}

/**
 * Disables autostart
 * @param {String} key
 * @param {Function} callback
 */

function disableAutostart(key, cb) {
  if (!key || !callback) {
    return callback(cb, 'Not enough arguments passed to disableAutostart()');
  }

  else if (typeof(key) !== 'string') {
    return callback(cb, 'Passed "key" to disableAutostart() is not a string.');
  }

  else if (typeof(callback) !== 'function') {
    return callback(cb, 'Passed "callback" to disableAutostart() is not a function.');
  }

  autostart.disableAutostart(key, function(err) {
    err ? cb(err) : modifyHomeFile(false, key);
  });
}

/**
 * Checks if autostart is enabled
 * @param {String} key
 * @param {Function} callback
 */

function isAutostartEnabled(key, cb) {
  if (!key || !callback) {
    return callback(cb, 'Not enough arguments passed to isAutostartEnabled()');
  }

  else if (typeof(key) !== 'string') {
    return callback(cb, 'Passed "key" to disableAutostart() is not a string.');
  }

  else if (typeof(callback) !== 'function') {
    return callback(cb, 'Passed "callback" to disableAutostart() is not a function.');
  }

  autostart.isAutostartEnabled(key, function(err, isEnabled) {
    cb(err, isEnabled);
  });
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
