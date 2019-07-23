import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const formats = ['json', 'yml', 'ini'];

describe.each(formats)('genDiff | generating difference between %s-files', (format) => {
  const pathToFixtures = '__tests__/__fixtures__/files';
  const pathToFile1 = path.join(pathToFixtures, `before.${format}`);
  const pathToFile2 = path.join(pathToFixtures, `after.${format}`);
  const fixturesPath = `${__dirname}/__fixtures__`;

  test(`should return the result of comparing ${format}-files in tree format`, () => {
    const actualResult = genDiff(pathToFile1, pathToFile2);
    const expectedResult = fs.readFileSync(`${fixturesPath}/diff-result-tree.txt`, 'utf8');

    expect(actualResult).toEqual(expectedResult);
  });

  test(`should return the result of comparing ${format}-files in plain format`, () => {
    const actualResult = genDiff(pathToFile1, pathToFile2, 'plain');
    const expectedResult = fs.readFileSync(`${fixturesPath}/diff-result-plain.txt`, 'utf8');

    expect(actualResult).toEqual(expectedResult);
  });

  test(`should return the result of comparing ${format}-files in json format`, () => {
    const actualResult = genDiff(pathToFile1, pathToFile2, 'json');
    const expectedResult = fs.readFileSync(`${fixturesPath}/diff-result.json`, 'utf8');

    expect(actualResult).toEqual(expectedResult);
  });
});
