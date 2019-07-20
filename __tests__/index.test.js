import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const formats = ['json', 'yml', 'ini'];

describe.each(formats)('genDiff | сравнение двух файлов', (format) => {
  const pathToFixtures = '__tests__/__fixtures__/files';
  const pathToFile1 = path.join(pathToFixtures, `before.${format}`);
  const pathToFile2 = path.join(pathToFixtures, `after.${format}`);
  const fixturesPath = `${__dirname}/__fixtures__`;

  describe('Если передан не передан формат (формат tree)', () => {
    test(`То возвращается результат сравнения ${format}-файлов в формате дерева`, () => {
      const actualResult = genDiff(pathToFile1, pathToFile2);
      const expectedResult = fs.readFileSync(`${fixturesPath}/diff-result-tree.txt`, 'utf8');

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('Если передан формат plain', () => {
    test(`То возвращается результат сравнения ${format}-файлов в плоском формате`, () => {
      const actualResult = genDiff(pathToFile1, pathToFile2, 'plain');
      const expectedResult = fs.readFileSync(`${fixturesPath}/diff-result-plain.txt`, 'utf8');

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('Если передан формат json', () => {
    test(`То возвращается результат сравнения ${format}-файлов в формате json`, () => {
      const actualResult = genDiff(pathToFile1, pathToFile2, 'json');
      const expectedResult = fs.readFileSync(`${fixturesPath}/diff-result.json`, 'utf8');

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
