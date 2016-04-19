#!/usr/bin/env node

'use strict';

const program = require('commander');
const cli = require('../lib');

program
  .version('0.1.0');

program
  .command('resolve <path> <line> <column>')
  .description('Returns the original source\'s line and column')
  .action(cli.resolve);

program
  .command('*', null, {noHelp: true})
  .action(function (cmd) {
    console.error('Unrecognized command: %s', cmd);
    program.help();
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
