'use strict';
let crontab = require('crontab');

function isAutostartEnabled(key, callback) {
  // Variable for temporarily saving crontab.load() as crontab.load() overwrites 'crontab'
  const tmpLoad = crontab.load;
  crontab.load((error, crontabData) => {
    // Make crontab's data globally available
    crontab = crontabData;
    crontab.load = tmpLoad;

    let err = null;

    if (process.env.FORCEERROR === 'true') {
      err = new Error('Test Error');
    }

    if (err || error) {
      callback(err || error, null);
      return;
    }

    if (crontab.jobs({
      comment: key,
    }).length === 0) {
      callback(null, false);
    } else {
      callback(null, true);
    }

    return;
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
    crontab.create(linuxCommand, '@reboot', key);

    crontab.save((err) => {
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

    crontab.remove({
      comment: key,
    });

    crontab.save((err) => {
      callback(err);
    });
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
