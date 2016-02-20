'use strict';
const fs = require('fs');
const username = require('username');
const fileExists = require('file-exists');

function isAutostartEnabled(key, callback) {
  let err;

  if (process.env.FORCEERROR === 'true') {
    err = new Error('Test error');
  } else {
    err = null;
  }

  callback(err, fileExists(`/Users/${username.sync()}/Library/LaunchAgents/${key}.plist`));
}

function enableAutostart(key, command, path, callback) {
  isAutostartEnabled(key, (error, isEnabled) => {
    if (isEnabled) {
      callback('Autostart already is enabled');
      return;
    }

    // Adding a service with the given key to launchd,
    // by placing a launchd compatible .plist
    // in the user's LaunchAgents folder
    const plistFileContent = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "
      -//Apple//DTD PLIST 1.0//EN"
       "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>${key}
      </string><key>ProgramArguments</key><array><string>bash</string><string>-c</string>
      <string>cd ${path} && ${command}
      </string></array><key>RunAtLoad</key><true/></dict></plist>`;

    const plistFileName = `/Users/${username.sync()}/Library/LaunchAgents/${key}.plist`;

    fs.writeFile(plistFileName, plistFileContent, (err) => {
      callback(err);
      return;
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

    // Removing the launchd .plist with the name of the passed key
    const plistFileName = `/Users/${username.sync()}/Library/LaunchAgents/${key}.plist`;

    fs.unlink(plistFileName, (err) => {
      callback(err);
    });
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
