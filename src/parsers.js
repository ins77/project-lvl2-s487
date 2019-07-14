import yaml from 'js-yaml';

export default {
  yml: yaml.safeLoad,
  json: JSON.parse,
};
