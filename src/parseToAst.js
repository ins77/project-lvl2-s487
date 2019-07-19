import _ from 'lodash';
import types from './types';

const parseToAST = (keys, firstConfig, secondConfig) => (
  keys.map((key) => {
    const firstConfigValue = firstConfig[key];
    const secondConfigValue = secondConfig[key];

    if (_.has(firstConfig, key) && !_.has(secondConfig, key)) {
      return { key, currentValue: firstConfigValue, type: types.removed };
    }

    if (!_.has(firstConfig, key) && _.has(secondConfig, key)) {
      return { key, currentValue: secondConfigValue, type: types.added };
    }

    if (firstConfigValue === secondConfigValue) {
      return { key, currentValue: secondConfigValue, type: types.unchanged };
    }

    if (_.isObject(firstConfigValue) && _.isObject(secondConfigValue)) {
      const innerKeys = _.union(Object.keys(firstConfigValue), Object.keys(secondConfigValue));
      const children = parseToAST(innerKeys, firstConfigValue, secondConfigValue);

      return { key, children, type: types.nested };
    }

    return {
      key,
      previousValue: firstConfigValue,
      currentValue: secondConfigValue,
      type: types.changed,
    };
  })
);

export default parseToAST;
