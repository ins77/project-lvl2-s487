import fs from 'fs';
import path from 'path';
import generateDiff from '../src';

test.each(['json', 'yml', 'ini'])('generateDiff | должно возвращать результат сравнения %s-файлов', (format) => {
  const pathToFixtures = '__tests__/__fixtures__/files';
  const pathToFile1 = path.join(pathToFixtures, `before.${format}`);
  const pathToFile2 = path.join(pathToFixtures, `after.${format}`);
  const actualResult = generateDiff(pathToFile1, pathToFile2);
  const expectedResult = fs.readFileSync(`${__dirname}/__fixtures__/diff-result.txt`, 'utf8');

  expect(actualResult).toEqual(expectedResult);
});
