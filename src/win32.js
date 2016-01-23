var fs = require('fs'),
  os = require('os'),
  username = require('username');

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
  isAutostartEnabled(key, function(error, isEnabled) {
    if (error) {
      if (error.code !== 'ENOENT') {
        callback(error);
        return;
      }
    }

    if (isEnabled) {
      callback('Autostart already is enabled');
      return;
    }

    var batchFileContent = 'cd ' + path + ' && ' + command;
    fs.writeFile(getWinStartupPath() + '/' + key + '.bat', batchFileContent, function(error) {
      callback(error);
    });
  });
}

function disableAutostart(key, callback) {
  isAutostartEnabled(key, function(error, isEnabled) {
    if (error) {
      if (error.code !== 'ENOENT') {
        callback(error);
        return;
      }
    }

    if (!isEnabled) {
      callback('Autostart is not enabled');
      return;
    }

    fs.unlink(getWinStartupPath() + '/' + key + '.bat', function(error) {
      callback(error);
    });
  });
}

function isAutostartEnabled(key, callback) {
  fs.stat(getWinStartupPath() + '/' + key + '.bat', function(error, stats) {
    if (process.env.NODE_ENV === 'test' && process.env.FORCEERROR === true) {
      error = new Error('Test error');
    }

    if (!error && stats.isFile()) {
      callback(null, true);
    } else {
      callback(error, false);
    }
  });
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
