import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { parsers, parse } from './parsers';
import render from './renders';

export default (firstConfig, secondConfig) => {
  const firstConfigPath = path.resolve(firstConfig);
  const secondConfigPath = path.resolve(secondConfig);
  const firstConfigInner = fs.readFileSync(firstConfigPath, 'utf8');
  const secondConfigInner = fs.readFileSync(secondConfigPath, 'utf8');
  const format = path.extname(firstConfigPath);
  const parseFile = parsers[format];
  const firstConfigObject = parseFile(firstConfigInner);
  const secondConfigObject = parseFile(secondConfigInner);
  const keys = _.union(Object.keys(firstConfigObject), Object.keys(secondConfigObject));
  const parsedData = parse(keys, firstConfigObject, secondConfigObject);

  return render(parsedData);
};
