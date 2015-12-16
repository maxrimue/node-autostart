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
    if(error) {
      callback(error);
      return;
    }

    if(isEnabled) {
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
    if(error) {
      callback(error);
      return;
    }

    if(!isEnabled) {
      callback('Autostart is not enabled');
      return;
    }

    fs.unlink(getWinStartupPath() + '/' + key + '.bat', function(error) {
      callback(error);
    });
  });
}

function isAutostartEnabled(key, callback) {
  fs.stat(getWinStartupPath() + '/' + key + '.bat', function(error, stat) {
    if (!error) {
      callback(null, true);
    } else if (error.code === 'ENOENT') {
      callback(null, false);
    } else {
      callback(error, null);
    }
  });
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
