import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import { _parseBinaryExpression } from '../src/parser/parse';
import { evaluateBinaryExpression } from '../src/evaluator/evaluate';
import { list } from '../src/utils/list';

describe('Evaluate', () => {
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
  });
});
