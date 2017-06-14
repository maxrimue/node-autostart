'use strict';
const fs = require('fs');
const os = require('os');
const username = require('username');
const fileExists = require('file-exists');

function getWinStartupPath() {
  if (os.release().substring(2, 0).replace('.', '') >= 6) {
    const firstPart = `C:\\Users\\${username.sync()}\\AppData\\`;
    const secondPart = 'Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup';
    return `${firstPart}${secondPart}`;
  }

  return `C:\\Documents and Settings\\${username.sync()}\\Start Menu\\Programs\\Startup`;
}

function isAutostartEnabled(key, callback) {
  let err;

  if (process.env.FORCEERROR === 'true') {
    err = new Error('Test error');
  } else {
    err = null;
  }

  callback(err, fileExists(`${getWinStartupPath()}/${key}.bat`));
}

function enableAutostart(key, command, path, callback) {
  isAutostartEnabled(key, (error, isEnabled) => {
    if (error) {
      callback(error);
      return;
    }

    if (isEnabled) {
      callback('Autostart already is enabled');
      return;
    }

    const batchFileContent = `cd ${path} && ${command}`;
    fs.writeFile(`${getWinStartupPath()}/${key}.bat`, batchFileContent, err => {
      callback(err);
    });
  });
}

function disableAutostart(key, callback) {
  isAutostartEnabled(key, (error, isEnabled) => {
    if (error) {
      callback(error);
      return;
    }

    if (!isEnabled) {
      callback('Autostart is not enabled');
      return;
    }

    fs.unlink(`${getWinStartupPath()}/${key}.bat`, err => {
      callback(err);
    });
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled
};
