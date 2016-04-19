#!/usr/bin/env node

'use strict';

const program = require('commander');
const cli = require('../lib');

program
  .version(require('../package.json').version);

program
  .command('resolve <path> <line> <column>')
  .description('Returns the original source\'s line and column')
  .option('--context [num]', 'Add num lines of leading and trailing context')
  .option('--no-marker', 'Does not include a column marker (^)')
  .action(cli.resolve);

program
  .command('*', null, { noHelp: true })
  .action(function (cmd) {
    console.error('Unrecognized command: %s', cmd);
    program.help();
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
