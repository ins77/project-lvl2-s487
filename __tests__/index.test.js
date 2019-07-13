import fs from 'fs';
import path from 'path';
import generateDiff from '../src';

test('generateDiff | должно возвращать результат сравнения json-файлов', () => {
  const pathToFile1 = path.resolve(__dirname, '__fixtures__/before.json');
  const pathToFile2 = path.resolve(__dirname, '__fixtures__/after.json');
  const actualResult = generateDiff(pathToFile1, pathToFile2);
  const expectedResult = fs.readFileSync(`${__dirname}/__fixtures__/diff-result.txt`, 'utf8');

  expect(actualResult).toEqual(expectedResult);
});
