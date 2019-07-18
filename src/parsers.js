import yaml from 'js-yaml';
import ini from 'ini';

export default {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};
