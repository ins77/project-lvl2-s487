import _ from 'lodash';

const getValue = (value) => {
  const resultValue = typeof value === 'string'
    ? `'${value}'`
    : value;

  return _.isObject(value)
    ? '[complex value]'
    : resultValue;
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

      if (status === 'removed') {
        return [...iAcc, `Property '${newPath}' was removed`];
      }

      if (status === 'added') {
        return [...iAcc, `Property '${newPath}' was added with value: ${getValue(currentValue)}`];
      }

      if (status === 'changed') {
        return [...iAcc, `Property '${newPath}' was updated. From ${getValue(previousValue)} to ${getValue(currentValue)}`];
      }

      return children === undefined
        ? iAcc
        : children.reduce((cAcc, cTree) => iter(cTree, `${newPath}.`, cAcc), iAcc);
    };

    return [...acc, iter(tree, '', [])];
  }, []);

  return _.flatten(diff).join('\n');
};
