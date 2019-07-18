import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers';
import parseToAST from './parseToAst';
import { formatToTree, formatToPlain } from './formatters';

const formatters = {
  tree: formatToTree,
  plain: formatToPlain,
};

export default (firstConfig, secondConfig, format = 'tree') => {
  const firstConfigPath = path.resolve(firstConfig);
  const secondConfigPath = path.resolve(secondConfig);
  const firstConfigInner = fs.readFileSync(firstConfigPath, 'utf8');
  const secondConfigInner = fs.readFileSync(secondConfigPath, 'utf8');
  const extension = path.extname(firstConfigPath);
  const parseFile = parsers[extension];
  const firstConfigObject = parseFile(firstConfigInner);
  const secondConfigObject = parseFile(secondConfigInner);
  const keys = _.union(Object.keys(firstConfigObject), Object.keys(secondConfigObject));
  const parsedData = parseToAST(keys, firstConfigObject, secondConfigObject);
  const formatFn = formatters[format];

  return formatFn(parsedData);
};
