#!/usr/bin/env node

import program from 'commander';
import generateDiff from '..';

program
  .version('0.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action(generateDiff)
  .parse(process.argv);
