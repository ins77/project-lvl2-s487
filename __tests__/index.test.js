import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const formats = ['json', 'yml', 'ini'];

test.each(formats)('genDiff | generating difference between %s-files', (format) => {
  const pathToFixtures = '__tests__/__fixtures__/files';
  const pathToFile1 = path.join(pathToFixtures, `before.${format}`);
  const pathToFile2 = path.join(pathToFixtures, `after.${format}`);
  const fixturesPath = `${__dirname}/__fixtures__`;

  let actualResult;
  let expectedResult;

  actualResult = genDiff(pathToFile1, pathToFile2);
  expectedResult = fs.readFileSync(`${fixturesPath}/diff-result-tree.txt`, 'utf8');
  expect(actualResult).toEqual(expectedResult);

  actualResult = genDiff(pathToFile1, pathToFile2, 'plain');
  expectedResult = fs.readFileSync(`${fixturesPath}/diff-result-plain.txt`, 'utf8');
  expect(actualResult).toEqual(expectedResult);

  actualResult = genDiff(pathToFile1, pathToFile2, 'json');
  expectedResult = fs.readFileSync(`${fixturesPath}/diff-result.json`, 'utf8');
  expect(actualResult).toEqual(expectedResult);
});
