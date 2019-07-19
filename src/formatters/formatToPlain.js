import _ from 'lodash';
import types from '../types';

const getValue = (value) => {
  const resultValue = typeof value === 'string'
    ? `'${value}'`
    : value;

  return _.isObject(value)
    ? '[complex value]'
    : resultValue;
};

const node = {
  [types.removed]: (acc, path) => [...acc, `Property '${path}' was removed`],
  [types.added]: (acc, path, { currentValue }) => [...acc, `Property '${path}' was added with value: ${getValue(currentValue)}`],
  [types.changed]: (acc, path, { currentValue, previousValue }) => (
    [...acc, `Property '${path}' was updated. From ${getValue(previousValue)} to ${getValue(currentValue)}`]
  ),
  [types.unchanged]: acc => acc,
  [types.nested]: (acc, path, { children }, iterFn) => (
    children.reduce((cAcc, cTree) => iterFn(cTree, `${path}.`, cAcc), acc)
  ),
};

export default (trees) => {
  const diff = trees.reduce((acc, tree) => {
    const iter = (iTree, changesPath, iAcc) => {
      const { key, type } = iTree;

      const path = `${changesPath}${key}`;

      return node[type](iAcc, path, iTree, iter);
    };

    return [...acc, iter(tree, '', [])];
  }, []);

  return _.flatten(diff).join('\n');
};
