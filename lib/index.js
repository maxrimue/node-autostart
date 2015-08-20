'use strict()';

var fs = require('fs'),
  exec = require('child_process').exec,
  os = require('os'),
  crontab = require('crontab');

if(process.env.NODE_ENV === 'test') var test = true;

/**
  * Enables autostart
  * @param {String} key
  * @param {String} command
  * @param {String} path
  * @param {Function} callback
  */

function enableAutostart(key, command, path, callback) {
  var err = '';

  if(!key || !command || !path || !callback) {
    if(!test) console.error('Not enough arguments passed to node-autostart, enableAutostart().');
    return 1;
  }

  if(typeof(key) !== 'string') {
    if(!test) console.error('node-autostart: Passed "key" to enableAutostart() is not a string.');
    return 1;
  }

  if(typeof(command) !== 'string') {
    if(!test) console.error('node-autostart: Passed "command" to enableAutostart() is not a string.');
    return 1;
  }

  if(typeof(path) !== 'string') {
    if(!test) console.error('node-autostart: Passed "path" to enableAutostart() is not a string.');
    return 1;
  }

  if(typeof(callback) !== 'function') {
    if(!test) console.error('node-autostart: Passed "callback" to enableAutostart() is not a function.');
    return 1;
  }

  isAutostartEnabled(key, function(isEnabled, error) {
    if (error !== null) {
      err = error;
      callback(err);
      return 1;
    }

    if (isEnabled === true) {
      err = 'Autostart already is enabled';
      callback(err);
      return 1;
    }

    if (os.platform() === 'darwin') {
      //Adding a service with the given key to launchd, using launchctl
      /* istanbul ignore next */
      exec('launchctl submit -l ' + key + ' cd ' + path + ' && ' + command, function(error, stdout, stderr) {
        if (error !== null) {
          err = error;
        } else if (stderr !== '') {
          err = stderr;
        }

        if (err === '' || err === undefined) err = null;
        callback(err);
      });
    //} else if (os.platform() === 'linux') {
      //crontab stuff
    //} else if (os.platform() === 'win32') {

    }
    /* istanbul ignore else */
    else {
        err = 'Your platform currently is not supported';
        callback(err);
    }
  });
}

/**
  * Disables autostart
  * @param {String} key
  * @param {Function} callback
  */

function disableAutostart(key, callback) {
  var err;

  if(!key || !callback) {
    if(!test) console.error('Not enough arguments passed to node-autostart, disableAutostart()');
    return 1;
  }

  if(typeof(key) !== 'string') {
    if(!test) console.error('node-autostart: Passed "key" to disableAutostart() is not a string.');
    return 1;
  }

  if(typeof(callback) !== 'function') {
    if(!test) console.error('node-autostart: Passed "callback" to disableAutostart() is not a function.');
    return 1;
  }

  isAutostartEnabled(key, function(isEnabled, error) {
    if (error !== null) {
      err = error;
      callback(err);
      return 1;
    }

    if (!isEnabled) {
      err = 'Autostart is not enabled, so you cannot disable it ¯\\_(ツ)_/¯';
      callback(err);
      return 1;
    }

    if (os.platform() === "darwin") {
      //Removing the launchd service with the name of the passed key
      /* istanbul ignore next */
      exec('launchctl remove ' + key, function(error, stdout, stderr) {
        if (error !== '') {
          err = error;
        } else if (stderr !== '') {
          err = stderr;
        }

        if (err === '' || err === undefined) err = null;

        callback(err);
      });
    //} else if (os.platform() === 'linux') {
      //crontab stuff
    //} else if (os.platform() === 'win32') {

    }
    /* istanbul ignore else */
    else {
      err = 'You platform currently is not supported';
      callback(err);
    }
  });
}

/**
  * Checks if autostart is enabled
  * @param {String} key
  * @param {Function} callback
  */

function isAutostartEnabled(key, callback) {
  var err;
  var isEnabled;

  if(!key || !callback) {
    if(!test) console.error('Not enough arguments passed to node-autostart, disableAutostart()');
    return 1;
  }

  if(typeof(key) !== 'string') {
    if(!test) console.error('node-autostart: Passed "key" to disableAutostart() is not a string.');
    return 1;
  }

  if(typeof(callback) !== 'function') {
    if(!test) console.error('node-autostart: Passed "callback" to disableAutostart() is not a function.');
    return 1;
  }

  if (os.platform() === "darwin") {
    /* istanbul ignore next */
    exec('launchctl list | grep -q "' + key + '"; printf $?', function(error, stdout, stderr) {
      if (error !== null) {
        err = error;
      } else if (stderr !== '') {
        err = stderr;
      }

      if (stdout === '0') {
        isEnabled = true;
      }
      else if (stdout === '1') {
        isEnabled = false;
      }
      else {
        err = 'An unexpected error happened trying to check the output of launchctl. Please report this.';
      }

      if(err === '' || err === undefined) err = null;

      callback(isEnabled, err);
    });
  //} else if (os.platform() === "linux") {
    //crontab stuff
  //} else if (os.platform() === "win32") {

  }
  /* istanbul ignore else */
  else {
    err = 'Your platform currently is not supported';
    callback(isEnabled = false, err);
  }
}

module.exports = {
  enableAutostart: enableAutostart,
  disableAutostart: disableAutostart,
  isAutostartEnabled: isAutostartEnabled
};
