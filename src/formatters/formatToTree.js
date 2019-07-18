import _ from 'lodash';

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

const build = (trees, depth) => {
  const diff = trees.map((tree) => {
    const {
      key,
      status,
      children,
      currentValue,
      previousValue,
    } = tree;

    if (status === 'removed') {
      return `${getTab(depth + 1)}- ${key}: ${stringify(currentValue, depth)}`;
    }

    if (status === 'added') {
      return `${getTab(depth + 1)}+ ${key}: ${stringify(currentValue, depth)}`;
    }

    if (status === 'changed') {
      const removed = `${getTab(depth + 1)}- ${key}: ${stringify(previousValue, depth)}`;
      const added = `${getTab(depth + 1)}+ ${key}: ${stringify(currentValue, depth)}`;

      return [removed, added];
    }

    const value = children === undefined
      ? `${stringify(currentValue, depth)}`
      : `{\n${build(children, depth + 2)}\n${getTab(depth + 2)}}`;

    return `${getTab(depth + 1)}  ${key}: ${value}`;
  });

  return _.flatten(diff).join('\n');
};

export default trees => `{\n${build(trees, 0)}\n}`;
