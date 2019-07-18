import _ from 'lodash';
import statuses from './statuses';

const parseToAST = (keys, firstConfig, secondConfig) => (
  keys.map((key) => {
    const firstConfigValue = firstConfig[key];
    const secondConfigValue = secondConfig[key];

    if (_.has(firstConfig, key) && !_.has(secondConfig, key)) {
      return { key, currentValue: firstConfigValue, status: statuses.removed };
    }

    if (!_.has(firstConfig, key) && _.has(secondConfig, key)) {
      return { key, currentValue: secondConfigValue, status: statuses.added };
    }

    if (firstConfigValue === secondConfigValue) {
      return { key, currentValue: secondConfigValue, status: statuses.unchanged };
    }

    if (_.isObject(firstConfigValue) && _.isObject(secondConfigValue)) {
      const innerKeys = _.union(Object.keys(firstConfigValue), Object.keys(secondConfigValue));
      const children = parseToAST(innerKeys, firstConfigValue, secondConfigValue);

      return { key, children, status: statuses.unchanged };
    }

    return {
      key,
      previousValue: firstConfigValue,
      currentValue: secondConfigValue,
      status: statuses.changed,
    };
  })
);

export default parseToAST;
