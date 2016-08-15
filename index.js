'use strict';

let autostart;
/* istanbul ignore next */
switch (process.platform) {
  case 'darwin':
    autostart = require('./lib/darwin.js');
    break;
  case 'linux':
    autostart = require('./lib/linux.js');
    break;
  case 'win32':
    autostart = require('./lib/win32.js');
    break;
  default:
    autostart = null;
}

function enableAutostart(key, command, path, callback) {
  if (arguments.length < 3) {
    throw new Error('Not enough arguments passed to enableAutostart()');
  } else if (typeof key !== 'string') {
    throw new Error('Passed "key" to enableAutostart() is not a string.');
  } else if (typeof command !== 'string') {
    throw new Error('Passed "command" to enableAutostart() is not a string.');
  } else if (typeof path !== 'string') {
    throw new Error('Passed "path" to enableAutostart() is not a string.');
  }

  if (typeof callback !== 'function') {
    return new Promise((resolve, reject) => {
      autostart.enableAutostart(key, command, path, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  return autostart.enableAutostart(key, command, path, error => {
    callback(error);
  });
}

function disableAutostart(key, callback) {
  if (arguments.length < 1) {
    throw new Error('Not enough arguments passed to disableAutostart()');
  } else if (typeof key !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  }

  if (typeof callback !== 'function') {
    return new Promise((resolve, reject) => {
      autostart.disableAutostart(key, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  autostart.disableAutostart(key, error => {
    callback(error);
  });
}

/**
 * Checks if autostart is enabled
 * @param {String} key
 * @param {Function} callback
 */

function isAutostartEnabled(key, callback) {
  if (arguments.length < 1) {
    throw new Error('Not enough arguments passed to isAutostartEnabled()');
  } else if (typeof key !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  }

  if (typeof callback !== 'function') {
    return new Promise((resolve, reject) => {
      autostart.isAutostartEnabled(key, (error, isEnabled) => {
        if (error) {
          reject(error);
        } else {
          resolve(isEnabled);
        }
      });
    });
  }

  autostart.isAutostartEnabled(key, (error, isEnabled) => {
    callback(error, isEnabled);
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled
};
