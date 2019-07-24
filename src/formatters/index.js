import formatToTree from './formatToTree';
import formatToPlain from './formatToPlain';
import formatToJSON from './formatToJson';

const formatters = {
  tree: formatToTree,
  plain: formatToPlain,
  json: formatToJSON,
};

export default (format, data) => formatters[format](data);
