#!/usr/bin/env node
'use strict';
const autostart = require('./index.js');

require('yargs')
.usage('Usage: $0 <command> [options]')
.command('enable', 'Enable autostart here with a custom key', (yargs, argv) => {
  argv = yargs
    .option('n', {
      demand: true,
      alias: 'name',
      describe: 'Name of the key for identifying startup objects',
      type: 'string',
      nargs: 1,
    })
    .option('c', {
      demand: false,
      alias: 'command',
      describe: 'Command to execute in the path',
      type: 'string',
      default: 'npm start',
    })
    .option('p', {
      demand: false,
      alias: 'path',
      describe: 'Place of execution of command',
      type: 'string',
      default: process.cwd(),
    })
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(false, 'Use --help for further information')
    .argv;

  autostart.enableAutostart(argv.n, argv.c, argv.p, (err) => {
    if (err) {
      console.error('An error occured while trying to enable autostart, here are the details:');
      console.error(err);
      process.exit(1);
    }

    console.log('Done!');
    process.exit(0);
  });
})
.command('disable', 'Disable autostart with key', (yargs, argv) => {
  argv = yargs
    .option('n', {
      demand: true,
      alias: 'name',
      describe: 'Name of the key for identifying startup objecst',
      type: 'string',
      nargs: 1,
    })
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(false, 'Use --help for further information')
    .argv;

  autostart.disableAutostart(argv.n, (err) => {
    if (err) {
      console.error('An error occured while trying to disable autostart, here are the details:');
      console.error(err);
      process.exit(1);
    }

    console.log('Done!');
    process.exit(0);
  });
})
.command('check', 'Check if autostart is enabled by key', (yargs, argv) => {
  argv = yargs
    .option('n', {
      demand: true,
      alias: 'name',
      describe: 'Name of the key for identifying startup objects',
      type: 'string',
      nargs: 1,
    })
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(false, 'Use --help for further information')
    .argv;

  autostart.isAutostartEnabled(argv.n, (err, isEnabled) => {
    if (err) {
      console.error('An error occured, here are the details:');
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
