import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import { _parseBinaryExpression } from '../src/parser/parse';
import { evaluateBinaryExpression } from '../src/evaluate/evaluate';

describe('Evaluate', () => {
  describe('Arithmetic Operations', () => {
    it('4 + 4 * 4', () => {
      const code = '4 + 4 * 4;';
      const tokens = tokenize(code);
      const parsed = _parseBinaryExpression(tokens);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(20);
    });
  });
});
