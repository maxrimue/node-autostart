'use strict';

require("babel-polyfill");

var fs = require('fs'),
    os = require('os'),
    username = require('username'),
    fileExists = require('file-exists');

/**
 * Returns the path for the startup folder in Windows
 * @returns {String} path
 */

function getWinStartupPath() {
  /* istanbul ignore next */ // Requires Windows testing envrionment which travis-ci doesn't support right now
  if (os.release().substring(2, 0).replace('.', '') >= 6) {
    return 'C:\\Users\\' + username.sync() + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup';
  } else {
    return 'C:\\Documents and Settings\\' + username.sync() + '\\Start Menu\\Programs\\Startup';
  }
}

function enableAutostart(key, path, command, callback) {
  isAutostartEnabled(key, function (error, isEnabled) {
    if (error) {
      callback(error);
      return;
    }

    if (isEnabled) {
      callback('Autostart already is enabled');
      return;
    }

    var batchFileContent = 'cd ' + path + ' && ' + command;
    fs.writeFile(getWinStartupPath() + '/' + key + '.bat', batchFileContent, function (error) {
      callback(error);
    });
  });
}

function disableAutostart(key, callback) {
  isAutostartEnabled(key, function (error, isEnabled) {
    if (error) {
      callback(error);
      return;
    }

    if (!isEnabled) {
      callback('Autostart is not enabled');
      return;
    }

    fs.unlink(getWinStartupPath() + '/' + key + '.bat', function (error) {
      callback(error);
    });
  });
}

function isAutostartEnabled(key, callback) {
  var err;

  if (process.env.FORCEERROR === 'true') {
    err = new Error('Test error');
  } else {
    err = null;
  }

  callback(err, fileExists(getWinStartupPath() + '/' + key + '.bat'));
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};