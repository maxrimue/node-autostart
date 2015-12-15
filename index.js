'use strict()';

const osName = process.platform;

var fs = require('fs'),
autostart = require('./lib/' + osName + '.js');

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

function enableAutostart(key, command, path, callback) {
  if (!key || !command || !path || !callback) {
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

  else if (typeof(callback) !== 'function') {
    throw new Error('Passed "callback" to enableAutostart() is not a function.');
  }

  autostart.enableAutostart(key, command, path, function(error) {
    if(error) {
      callback(error);
    }
    else {
      modifyHomeFile(true, key, command, path);
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
  if (!key || !callback) {
    throw new Error('Not enough arguments passed to disableAutostart()');
  }

  else if (typeof(key) !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  }

  else if (typeof(callback) !== 'function') {
    throw new Error('Passed "callback" to disableAutostart() is not a function.');
  }

  autostart.disableAutostart(key, function(error) {
    if(error) {
      callback(error);
    }
    else {
      modifyHomeFile(false, key);
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
  if (!key || !callback) {
    throw new Error('Not enough arguments passed to isAutostartEnabled()');
  }

  else if (typeof(key) !== 'string') {
    throw new Error('Passed "key" to disableAutostart() is not a string.');
  }

  else if (typeof(callback) !== 'function') {
    throw new Error('Passed "callback" to disableAutostart() is not a function.');
  }

  autostart.isAutostartEnabled(key, function(error, isEnabled) {
    callback(error, isEnabled);
  });
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
