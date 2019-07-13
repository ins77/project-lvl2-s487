import fs from 'fs';
import path from 'path';
import generateDiff from '../src';

test('generateDiff | должно возвращать результат сравнения json-файлов', () => {
  const pathToFixtures = '__tests__/__fixtures__';
  const pathToFile1 = path.join(pathToFixtures, 'before.json');
  const pathToFile2 = path.join(pathToFixtures, 'after.json');
  const actualResult = generateDiff(pathToFile1, pathToFile2);
  const expectedResult = fs.readFileSync(`${__dirname}/__fixtures__/diff-result.txt`, 'utf8');

  expect(actualResult).toEqual(expectedResult);
});
