#!/usr/bin/env node

require("babel-polyfill");

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
  .demand(1)
  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Use --help for further information')
  .argv;
