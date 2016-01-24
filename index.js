'use strict()';
const osName = process.platform;

var fs = require('fs'),
autostart = require('./lib/' + osName + '.js');

/**
 * Enables autostart
 * @param {String} key
 * @param {String} command
 * @param {String} path
 * @param {Function} callback
 */

function enableAutostart(key, command, path, callback) {
  if (arguments.length < 3) {
    throw new Error('Not enough arguments passed to enableAutostart()');
  }

  else if (typeof(key) !== 'string') {
    throw new Error('Passed "key" to enableAutostart() is not a string.');
  }

  else if (typeof(command) !== 'string') {
    throw new Error('Passed "command" to enableAutostart() is not a string.');
  }

  else if (typeof(path) !== 'string') {
    throw new Error('Passed "path" to enableAutostart() is not a string.');
  }

  return new Promise((resolve, reject) => {
    autostart.enableAutostart(key, command, path, function(error) {
      if(typeof callback === 'function') {
        callback(error);
      } else {
        if(!error) resolve();
        else reject(error);
      }
    });
  });
}

/**
 * Disables autostart
 * @param {String} key
 * @param {Function} callback
 */

function disableAutostart(key, callback) {
  if (arguments.length < 1) {
    throw new Error('Not enough arguments passed to disableAutostart()');
  }

  else if (typeof(key) !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  }

  return new Promise((resolve, reject) => {
    autostart.disableAutostart(key, function(error) {
      if(typeof callback === 'function') {
        callback(error);
      } else {
        if(!error) resolve();
        else reject(error);
      }
    });
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
  }

  else if (typeof(key) !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  }

  return new Promise((resolve, reject) => {
    autostart.isAutostartEnabled(key, function(error, isEnabled) {
      if(typeof callback === 'function') {
        callback(error, isEnabled);
      } else {
        if(!error) resolve(isEnabled);
        else reject(error);
      }
    });
  });
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
