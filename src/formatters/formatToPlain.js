import _ from 'lodash';
import types from '../types';

const getValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  return typeof value === 'string'
    ? `'${value}'`
    : value;
};

const statuses = {
  [types.removed]: path => `Property '${path}' was removed`,
  [types.added]: (path, { value }) => `Property '${path}' was added with value: ${getValue(value)}`,
  [types.changed]: (path, { value }) => (
    `Property '${path}' was updated. From ${getValue(value.previous)} to ${getValue(value.current)}`
  ),
  [types.nested]: (path, { children }, getDiff) => getDiff(children, `${path}.`),
};

export default (trees) => {
  const getDiff = (nodes, fullPath) => (
    nodes
      .filter(node => node.type !== types.unchanged)
      .map(node => statuses[node.type](`${fullPath}${node.key}`, node, getDiff))
  );

  return _.flatten(getDiff(trees, '')).join('\n');
};
