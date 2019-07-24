import fs from 'fs';
import path from 'path';
import parseData from './parsers';
import parseToAST from './parseToAst';
import formatData from './formatters';

export default (firstConfig, secondConfig, format = 'tree') => {
  const firstConfigPath = path.resolve(firstConfig);
  const secondConfigPath = path.resolve(secondConfig);
  const firstConfigInner = fs.readFileSync(firstConfigPath, 'utf8');
  const secondConfigInner = fs.readFileSync(secondConfigPath, 'utf8');
  const extension = path.extname(firstConfigPath);
  const firstConfigObject = parseData(extension, firstConfigInner);
  const secondConfigObject = parseData(extension, secondConfigInner);
  const ast = parseToAST(firstConfigObject, secondConfigObject);

  return formatData(format, ast);
};
