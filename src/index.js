import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers';

const treeFactory = () => {
  // TODO: выенсти сюда создание объектов из parseData
};

// TODO:
const map = (fn, tree) => {
  const mappedTree = fn(tree);
  const { children } = tree;

  if (!children) {
    return mappedTree;
  }

  return children.map(item => map(fn, item));
}

const parseData = (keys, firstConfig, secondConfig) => {
  return keys.map((key) => {
    const firstConfigValue = firstConfig[key];
    const secondConfigValue = secondConfig[key];

    if (_.has(firstConfig, key) && !_.has(secondConfig, key)) {
      return { key, currentValue: firstConfigValue, status: 'removed' };
    }

    if (!_.has(firstConfig, key) && _.has(secondConfig, key)) {
      return { key, currentValue: secondConfigValue, status: 'added' };
    }

    if (firstConfigValue === secondConfigValue) {
      return { key, currentValue: secondConfigValue, status: 'unchanged' };
    }

    if (_.isObject(firstConfigValue) && _.isObject(secondConfigValue)) {
      const innerKeys = _.union(Object.keys(firstConfigValue), Object.keys(secondConfigValue));
      const children = parseData(innerKeys, firstConfigValue, secondConfigValue);

      return { key, children, status: 'unchanged' };
    }

    return { key, previousValue: firstConfigValue, currentValue: `${secondConfigValue}`, status: 'changed' };
  });
};

const diffsObject = {
  removed: ({ key, currentValue }) => [`  - ${key}: ${currentValue}`],
  added: ({ key, currentValue }) => [`  + ${key}: ${currentValue}`],
  unchanged: ({ key, currentValue }) => [`    ${key}: ${currentValue}`],
  changed: ({ key, previousValue, currentValue }) => [`  + ${key}: ${previousValue}`, `  - ${key}: ${currentValue}`],
};

// const reduce = (fn, trees) => {

// };

const renderData = (trees) => {
  console.log(trees[0]);
  const diff = trees.reduce((acc, currentTree) => {
    return [...acc, ...diffsObject[currentTree.status](currentTree)];
  }, []);

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

  return renderData(parsedData);
};
