import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers';
import parseToAST from './parseToAst';
import { formatToTree, formatToPlain, formatToJSON } from './formatters';

const formatters = {
  tree: formatToTree,
  plain: formatToPlain,
  json: formatToJSON,
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
  const formatFn = formatters[format];
  const ast = parseToAST(firstConfigObject, secondConfigObject);

  return formatFn(ast);
};
