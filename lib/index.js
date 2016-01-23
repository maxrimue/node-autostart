'use strict';
'use strict()';

var osName = process.platform;

var fs = require('fs'),
    autostart = require('./' + osName + '.js');

/**
 * Enables autostart
 * @param {String} key
 * @param {String} command
 * @param {String} path
 * @param {Function} callback
 */

function enableAutostart(key, command, path, callback) {
  if (arguments.length !== 4) {
    throw new Error('Not enough arguments passed to enableAutostart()');
  } else if (typeof key !== 'string') {
    throw new Error('Passed "key" to enableAutostart() is not a string.');
  } else if (typeof command !== 'string') {
    throw new Error('Passed "command" to enableAutostart() is not a string.');
  } else if (typeof path !== 'string') {
    throw new Error('Passed "path" to enableAutostart() is not a string.');
  } else if (typeof callback !== 'function') {
    throw new Error('Passed "callback" to enableAutostart() is not a function.');
  }

  autostart.enableAutostart(key, command, path, function (error) {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
}

/**
 * Disables autostart
 * @param {String} key
 * @param {Function} callback
 */

function disableAutostart(key, callback) {
  if (arguments.length !== 2) {
    throw new Error('Not enough arguments passed to disableAutostart()');
  } else if (typeof key !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  } else if (typeof callback !== 'function') {
    throw new Error('Passed "callback" to disableAutostart() is not a function.');
  }

  autostart.disableAutostart(key, function (error) {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
}

/**
 * Checks if autostart is enabled
 * @param {String} key
 * @param {Function} callback
 */

function isAutostartEnabled(key, callback) {
  if (arguments.length !== 2) {
    throw new Error('Not enough arguments passed to isAutostartEnabled()');
  } else if (typeof key !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  } else if (typeof callback !== 'function') {
    throw new Error('Passed "callback" to disableAutostart() is not a function.');
  }

  autostart.isAutostartEnabled(key, function (error, isEnabled) {
    callback(error, isEnabled);
  });
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};