import _ from 'lodash';
import statuses from '../statuses';

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

const node = {
  [statuses.removed]: (tree, depth) => (
    `${getTab(depth + 1)}- ${tree.key}: ${stringify(tree.currentValue, depth)}`
  ),
  [statuses.added]: (tree, depth) => (
    `${getTab(depth + 1)}+ ${tree.key}: ${stringify(tree.currentValue, depth)}`
  ),
  [statuses.changed]: (tree, depth) => (
    [
      `${getTab(depth + 1)}- ${tree.key}: ${stringify(tree.previousValue, depth)}`,
      `${getTab(depth + 1)}+ ${tree.key}: ${stringify(tree.currentValue, depth)}`,
    ]
  ),
  [statuses.unchanged]: (tree, depth, buildFn) => (
    tree.children === undefined
      ? `${getTab(depth + 1)}  ${tree.key}: ${stringify(tree.currentValue, depth)}`
      : `${getTab(depth + 1)}  ${tree.key}: {\n${buildFn(tree.children, depth + 2)}\n${getTab(depth + 2)}}`
  ),
};

const build = (trees, depth) => {
  const diff = trees.map(tree => node[tree.status](tree, depth, build));

  return _.flatten(diff).join('\n');
};

export default trees => `{\n${build(trees, 0)}\n}`;
