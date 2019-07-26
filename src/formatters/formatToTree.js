import _ from 'lodash';
import types from '../types';

const getTab = depth => '  '.repeat(depth);

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const arr = Object.entries(value).reduce((acc, [key, val]) => (
    [...acc, `${getTab(depth + 4)}${key}: ${val}`]
  ), []);

  return `{\n${arr.join('\n')}\n${getTab(depth + 2)}}`;
};

const nodes = {
  [types.removed]: ({ key, value }, depth) => `${getTab(depth + 1)}- ${key}: ${stringify(value, depth)}`,
  [types.added]: ({ key, value }, depth) => `${getTab(depth + 1)}+ ${key}: ${stringify(value, depth)}`,
  [types.unchanged]: ({ key, value }, depth) => `${getTab(depth + 1)}  ${key}: ${stringify(value, depth)}`,
  [types.changed]: ({ key, previousValue, currentValue }, depth) => (
    [
      `${getTab(depth + 1)}- ${key}: ${stringify(previousValue, depth)}`,
      `${getTab(depth + 1)}+ ${key}: ${stringify(currentValue, depth)}`,
    ]
  ),
  [types.nested]: ({ key, children }, depth, buildFn) => (
    `${getTab(depth + 1)}  ${key}: {\n${buildFn(children, depth + 2)}\n${getTab(depth + 2)}}`
  ),
};

const build = (trees, depth) => {
  const diff = trees.map(tree => nodes[tree.type](tree, depth, build));

  return _.flatten(diff).join('\n');
};

export default trees => `{\n${build(trees, 0)}\n}`;
