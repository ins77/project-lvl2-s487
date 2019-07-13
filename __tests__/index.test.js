import fs from 'fs';
import generateDiff from '../src';

test('generateDiff | должно возвращать результат сравнения json-файлов', () => {
  const pathToFixtures = '../__tests__/__fixtures__';
  const pathToFile1 = `${pathToFixtures}/before.json`;
  const pathToFile2 = `${pathToFixtures}/after.json`;
  const actualResult = generateDiff(pathToFile1, pathToFile2);
  const expectedResult = fs.readFileSync(`${__dirname}/__fixtures__/diff-result.txt`, 'utf8');

  expect(actualResult).toEqual(expectedResult);
});
