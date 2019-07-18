import _ from 'lodash';
import statuses from '../statuses';

const getValue = (value) => {
  const resultValue = typeof value === 'string'
    ? `'${value}'`
    : value;

  return _.isObject(value)
    ? '[complex value]'
    : resultValue;
};

const node = {
  [statuses.removed]: path => `Property '${path}' was removed`,
  [statuses.added]: (path, currentValue) => `Property '${path}' was added with value: ${currentValue}`,
  [statuses.changed]: (path, currentValue, previousValue) => (
    `Property '${path}' was updated. From ${previousValue} to ${currentValue}`
  ),
};

export default (trees) => {
  const diff = trees.reduce((acc, tree) => {
    const iter = (iTree, changesPath, iAcc) => {
      const {
        key,
        status,
        previousValue,
        currentValue,
        children,
      } = iTree;

      const newPath = `${changesPath}${key}`;

      if (status !== statuses.unchanged) {
        return [...iAcc, node[status](newPath, getValue(currentValue), getValue(previousValue))];
      }

      return children === undefined
        ? iAcc
        : children.reduce((cAcc, cTree) => iter(cTree, `${newPath}.`, cAcc), iAcc);
    };

    return [...acc, iter(tree, '', [])];
  }, []);

  return _.flatten(diff).join('\n');
};
