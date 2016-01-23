#!/usr/bin/env node

var fs = require('fs'),
  colors = require('colors'),
  username = require('username'),
  autostart = require('./index.js'),
  argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('enable', 'Enable autostart here with a custom key', function(yargs) {
    argv = yargs
      .option('n', {
        demand: true,
        alias: 'name',
        describe: 'Name of the key for identifying startup objects',
        type: 'string',
        nargs: 1
      })
      .option('c', {
        demand: false,
        alias: 'command',
        describe: 'Command to execute in the path',
        type: 'string',
        default: 'npm start'
      })
      .option('p', {
        demand: false,
        alias: 'path',
        describe: 'Place of execution of command',
        type: 'string',
        default: process.cwd()
      })
      .help('h')
      .alias('h', 'help')
      .showHelpOnFail(false, 'Use --help for further information')
      .argv;

    autostart.enableAutostart(argv.n, argv.c, argv.p, function(err) {
      if (err) {
        console.error('An error occured while trying to enable autostart, here are the details:');
        console.error(err);
        process.exit(1);
      }

      console.log('Done!');
      process.exit(0);
    });
  })
  .command('disable', 'Disable autostart with key', function(yargs) {
    argv = yargs
      .option('n', {
        demand: true,
        alias: 'name',
        describe: 'Name of the key for identifying startup objecst',
        type: 'string',
        nargs: 1
      })
      .help('h')
      .alias('h', 'help')
      .showHelpOnFail(false, 'Use --help for further information')
      .argv;

    autostart.disableAutostart(argv.n, function(err) {
      if (err) {
        console.error('An error occured while trying to disable autostart, here are the details:');
        console.error(err);
        process.exit(1);
      }

      console.log('Done!');
      process.exit(0);
    });
  })
  .command('check', 'Check if autostart is enabled by key', function(yargs) {
    argv = yargs
      .option('n', {
        demand: true,
        alias: 'name',
        describe: 'Name of the key for identifying startup objects',
        type: 'string',
        nargs: 1
      })
      .help('h')
      .alias('h', 'help')
      .showHelpOnFail(false, 'Use --help for further information')
      .argv;

    autostart.isAutostartEnabled(argv.n, function(err, isEnabled) {
      if (err) {
        console.error('An error occured while trying to check if autostart is enabled, here are the details:');
        console.error(err);
        process.exit(1);
      }

      console.log('Done!');
      if (isEnabled) {
        console.log('Autostart is enabled');
        process.exit(0);
      } else if (!isEnabled) {
        console.log('Autostart is not enabled');
        process.exit(0);
      }
    });
  })
  .command('doctor', 'See all enabled autostart services', function(yargs) {
    argv = yargs
      .option('f', {
        alias: 'find',
        describe: 'Let node-autostart find broken services (active but nonexistant)'
      })
      .help('h')
      .alias('h', 'help')
      .showHelpOnFail(false, 'Use --help for further information')
      .argv;

    try {
      fs.statSync((process.env.HOME || process.env.USERPROFILE) + '/.autostart.json');
    } catch (e) {
      console.error('No .autostart file for the user ' + username.sync() + ' found. Aborting.');
      process.exit(1);
    }

    var services = JSON.parse(fs.readFileSync((process.env.HOME || process.env.USERPROFILE) + '/.autostart.json', 'utf-8'));

    if (!Object.keys(services).length) {
      console.log('No services enabled.'.red);
      process.exit(0);
    }

    console.log('These services are currently active:');

    for(var i in services) {
      console.log(('"' + i + '":').inverse, ('\n   Path: ' + services[i].path).green, ('\n   Command: ' + services[i].command).green);
    }

    if (argv.f) {
      var brokenServices = [];
      for (var key in services) {
        if(services[key].path !== 'undefined') {
          try {
            fs.statSync(services[key].path);
          } catch (e) {
            brokenServices.push(key);
          }
        }
      }

      console.log('\nFollowing services are considered broken: ');
      for(key = 0; key < brokenServices.length; key++) {
        console.log(('"' + i + '":').inverse, ('\n   Path: ' + services[i].path).red, ('\n   Command: ' + services[i].command).green);
      }
    }
  })
  .demand(1)
  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Use --help for further information')
  .argv;
