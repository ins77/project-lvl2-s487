import _ from 'lodash';
import types from './types';

const propertyActions = [
  {
    check: (key, firstConfig, secondConfig) => !_.has(secondConfig, key),
    getValue: (key, firstConfig) => ({
      type: types.removed,
      value: firstConfig[key],
    }),
  },
  {
    check: (key, firstConfig) => !_.has(firstConfig, key),
    getValue: (key, firstConfig, secondConfig) => ({
      type: types.added,
      value: secondConfig[key],
    }),
  },
  {
    check: (key, firstConfig, secondConfig) => firstConfig[key] === secondConfig[key],
    getValue: (key, firstConfig, secondConfig) => ({
      type: types.unchanged,
      value: secondConfig[key],
    }),
  },
  {
    check: (key, firstConfig, secondConfig) => (
      _.isObject(firstConfig[key]) && _.isObject(secondConfig[key])
    ),
    getValue: (key, firstConfig, secondConfig, parse) => (
      {
        type: types.nested,
        children: parse(firstConfig[key], secondConfig[key]),
      }
    ),
  },
  {
    check: (key, firstConfig, secondConfig) => firstConfig[key] !== secondConfig[key],
    getValue: (key, firstConfig, secondConfig) => ({
      type: types.changed,
      previousValue: firstConfig[key],
      currentValue: secondConfig[key],
    }),
  },
];

const getPropertyAction = (key, firstConfig, secondConfig) => (
  propertyActions.find(({ check }) => check(key, firstConfig, secondConfig))
);

const parseToAST = (firstConfig, secondConfig) => {
  const keys = _.union(Object.keys(firstConfig), Object.keys(secondConfig));

  return keys.map((key) => {
    const node = getPropertyAction(key, firstConfig, secondConfig);

    return { key, ...node.getValue(key, firstConfig, secondConfig, parseToAST) };
  });
};

export default parseToAST;
