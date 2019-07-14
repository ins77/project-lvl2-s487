import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers';

const parseData = (keys, firstConfig, secondConfig) => {
  return keys.map((key) => {
    if (_.has(firstConfig, key) && !_.has(secondConfig, key)) {
      return { key, status: 'removed' };
    }

    if (!_.has(firstConfig, key) && _.has(secondConfig, key)) {
      return { key, status: 'added' };
    }

    return firstConfig[key] === secondConfig[key]
      ? { key, status: 'unchanged' }
      : { key, status: 'changed' };
  });
};

const diffsObject = {
  removed: (key, firstConfig) => [`  - ${key}: ${firstConfig[key]}`],
  added: (key, firstConfig, secondConfig) => [`  + ${key}: ${secondConfig[key]}`],
  unchanged: (key, firstConfig, secondConfig) => [`    ${key}: ${secondConfig[key]}`],
  changed: (key, firstConfig, secondConfig) => [`  + ${key}: ${secondConfig[key]}`, `  - ${key}: ${firstConfig[key]}`],
};

const renderData = (trees, firstConfig, secondConfig) => {
  const diff = trees.reduce((acc, { key, status }) => (
    [...acc, ...diffsObject[status](key, firstConfig, secondConfig)]
  ), []);

  return `{\n${diff.join('\n')}\n}`;
};

export default (firstConfig, secondConfig) => {
  const firstConfigPath = path.resolve(firstConfig);
  const secondConfigPath = path.resolve(secondConfig);
  const firstConfigInner = fs.readFileSync(firstConfigPath, 'utf8');
  const secondConfigInner = fs.readFileSync(secondConfigPath, 'utf8');
  const format = path.extname(firstConfigPath);
  const parse = parsers[format.slice(1)];
  const firstConfigObject = parse(firstConfigInner);
  const secondConfigObject = parse(secondConfigInner);

  const keys = _.union(Object.keys(firstConfigObject), Object.keys(secondConfigObject));
  const parsedData = parseData(keys, firstConfigObject, secondConfigObject);

  return renderData(parsedData, firstConfigObject, secondConfigObject);
};
