import fs from 'fs';
import _ from 'lodash';

const generateDiff = (firstConfig, secondConfig) => {
  const firstConfigInner = fs.readFileSync(firstConfig, 'utf8');
  const secondConfigInner = fs.readFileSync(secondConfig, 'utf8');
  const firstConfigObject = JSON.parse(firstConfigInner);
  const secondConfigObject = JSON.parse(secondConfigInner);
  const firstConfigEntries = Object.entries(firstConfigObject);
  const secondConfigEntries = Object.entries(secondConfigObject);

  const diff1 = firstConfigEntries.reduce((acc, [key, value]) => {
    if (_.has(secondConfigObject, key)) {
      const secondObjectValue = secondConfigObject[key];

      return secondObjectValue === value
        ? [...acc, `  ${key}: ${value}`]
        : [...acc, `+ ${key}: ${secondObjectValue}`, `- ${key}: ${value}`];
    }

    return [...acc, `- ${key}: ${value}`];
  }, []);

  const diff2 = secondConfigEntries.reduce((acc, [key, value]) => (
    _.has(firstConfigObject, key)
      ? acc
      : [...acc, `+ ${key}: ${value}`]
  ), diff1);

  const result = diff2.map(item => `  ${item}`).join('\n');

  return `{\n${result}\n}`;
};

export default generateDiff;
