import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

export const parsers = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

export const parse = (keys, firstConfig, secondConfig) => {
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
      const children = parse(innerKeys, firstConfigValue, secondConfigValue);

      return { key, children, status: 'unchanged' };
    }

    return {
      key,
      previousValue: firstConfigValue,
      currentValue: secondConfigValue,
      status: 'changed',
    };
  });
};
