'use strict';

require("babel-polyfill");

var fs = require('fs'),
    crontab = require('crontab');

function enableAutostart(key, command, path, callback) {
  isAutostartEnabled(key, function (error, isEnabled) {
    if (error) {
      callback(error);
      return;
    }

    if (isEnabled) {
      callback('Autostart already is enabled');
      return;
    }

    var linuxCommand = 'cd ' + path + ' && ' + command;
    crontab.create(linuxCommand, '@reboot', key);

    crontab.save(function (error) {
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

    crontab.remove({
      comment: key
    });

    crontab.save(function (error) {
      callback(error);
    });
  });
}

function isAutostartEnabled(key, callback) {
  var tmpLoad = crontab.load; //Variable for temporarily saving crontab.load() as crontab.load() overwrites 'crontab'
  crontab.load(function (error, crontabData) {
    crontab = crontabData; //Make crontab's data globally available
    crontab.load = tmpLoad;

    if (process.env.NODE_ENV === 'test' && process.env.FORCEERROR === 'true') {
      error = new Error('Test Error');
    }

    if (error) {
      callback(error, null);
      return;
    }

    if (crontab.jobs({
      comment: key
    }).length == '0') {
      callback(null, false);
    } else {
      callback(null, true);
    }

    return;
  });
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};