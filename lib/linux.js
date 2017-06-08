'use strict';
const crontab = require('crontab');

let crontabData = null;

function isAutostartEnabled(key, callback) {
  crontab.load((error, result) => {
    let err = null;
    crontabData = result;

    if (process.env.FORCEERROR === 'true') {
      err = new Error('Test Error');
    }

    if (err || error) {
      callback(err || error, null);
      return;
    }

    if (crontabData.jobs({
      comment: key
    }).length === 0) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
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

    const linuxCommand = `cd ${path} && ${command}`;
    crontabData.create(linuxCommand, '@reboot', key);

    crontabData.save(err => {
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

    crontabData.remove({
      comment: key
    });

    crontabData.save(err => {
      callback(err);
    });
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled
};
