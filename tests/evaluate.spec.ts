import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import { _parseBinaryExpression } from '../src/parser/parse';
import { evaluateBinaryExpression } from '../src/evaluate/evaluate';
import { list } from '../src/utils/list';

describe('Evaluate', () => {
  describe('Arithmetic Operations', () => {
    it('4 + 4 * 4', () => {
      const code = '4 + 4 * 4;';
      const tokens = tokenize(code);
      const li = list(tokens);
      const parsed = _parseBinaryExpression(li);
      const result = evaluateBinaryExpression(parsed);
      expect(result).to.eq(20);
    });
  });
});
