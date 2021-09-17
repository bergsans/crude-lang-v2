import { expect } from 'chai';
import { Tokens, Token, tokenize } from '../src/lexer/tokenize';
import { _parseBinaryExpression } from '../src/parser/parse';

describe('ExpressionStatement', () => {
  describe('BinaryExpression', () => {
    it('4 + 4;', () => {
      const code = '4 + 4;';
      const expectedResult = {
        type: 'BinaryExpression',
        left: {
          value: {
            type: 'INTEGER',
            literal: '4',
          },
        },
        value: {
          type: 'PLUS',
          literal: '+',
        },
        right: {
          value: {
            type: 'INTEGER',
            literal: '4',
          },
        },
      };
      const tokens = tokenize(code).map(
        ({ type, literal }: Partial<Token>) => ({
          type,
          literal,
        })
      );
      const result = _parseBinaryExpression(tokens as Tokens);
      expect(result).to.deep.equal(expectedResult);
    });

    it('4 + 4 * 20', () => {
      const code = '4 + 4 * 20;';
      const expectedResult = {
        type: 'BinaryExpression',
        left: {
          value: {
            type: 'INTEGER',
            literal: '4',
          },
        },
        value: {
          type: 'PLUS',
          literal: '+',
        },
        right: {
          value: {
            type: 'INTEGER',
            literal: '4',
          },
        },
      };

      const tokens = tokenize(code).map(
        ({ type, literal }: Partial<Token>) => ({
          type,
          literal,
        })
      );
      const result = _parseBinaryExpression(tokens as Tokens);
      expect(result).to.deep.equal(expectedResult);
    });
  });
});
