#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

program
  .version('0.1.0')
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .action((firstConfig, secondConfig, { format }) => {
    console.log(genDiff(firstConfig, secondConfig, format));
  })
  .parse(process.argv);
