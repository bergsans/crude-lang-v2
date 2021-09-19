import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import { _parseBinaryExpression } from '../src/parser/parse';
import { evaluateBinaryExpression } from '../src/evaluator/evaluate';
import { list } from '../src/utils/list';

describe('Evaluate', () => {
  describe('Boolean Operations', () => {
    const truthTable = [
      ['true && true;', true],
      ['true && false;', false],
      ['true || false;', true],
      ['false || false;', false],
    ];
    for (const [code, expectedResult] of truthTable) {
      it(`${code} is ${expectedResult}` as string, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  // Todo: Remove boolean examples
  describe('Arithmetic Operations', () => {
    it('4 + 4 * 4 is 20', () => {
      const code = '4 + 4 * 4;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(20);
    });

    it('4 - 2 is 2', () => {
      const code = '4 - 2;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(2);
    });

    it('(4 - 1) * 3  is 9', () => {
      const code = '(4 - 1) * 3;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(9);
    });

    it('4 < 5 && 5 > 4 is true', () => {
      const code = '4 < 5 && 5 > 4;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(true);
    });

    it('4 < 5 && 5 > 6 is true', () => {
      const code = '4 < 5 && 5 > 6;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(false);
    });

    it('4 < 5 || 5 > 6 is true', () => {
      const code = '4 < 5 || 5 > 6;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(true);
    });

    it('6 < 5 || 5 > 6 is true', () => {
      const code = '6 < 5 || 5 > 6;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(false);
    });

    it('4 == 4 is true', () => {
      const code = '4 == 4;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(true);
    });

    it('4 == 2 is false', () => {
      const code = '4 == 2;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(false);
    });

    it('2 + 2 == 4 is true', () => {
      const code = '2 + 2 == 4;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(true);
    });

    it('2 + 2 == 5 is false', () => {
      const code = '2 + 2 == 5;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(false);
    });

    it('true == true', () => {
      const code = 'true == true;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(true);
    });

    it('true == false', () => {
      const code = 'true == false;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(false);
    });

    it('3 < 2 is false', () => {
      const code = '3 < 2;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(false);
    });

    it('3 > 2 is true', () => {
      const code = '3 > 2;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(true);
    });

    it('3 <= 3 is true and 2 <= 3', () => {
      for (const [code, expectedResult] of [
        ['3 <= 3;', true],
        ['2 <= 3;', true],
        ['3 <= 2;', false],
      ]) {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed);
        expect(result).to.eq(expectedResult);
      }
    });

    it('3 >= 3 is true and 3 >= 2', () => {
      for (const [code, expectedResult] of [
        ['3 >= 3;', true],
        ['3 >= 2;', true],
        ['3 <= 2;', false],
      ]) {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed);
        expect(result).to.eq(expectedResult);
      }
    });
  });
});
