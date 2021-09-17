import { expect } from 'chai';
import { Tokens, Token, tokenize } from '../src/lexer/tokenize';
import {
  parseLiteralExpression,
  _parseBinaryExpression,
} from '../src/parser/parse';

describe('ExpressionStatement', () => {
  describe('Integer', () => {
    it('4;', () => {
      // const code = '4;';
      // const tokens = tokenize(code);
      const result = parseLiteralExpression({
        type: 'Integer',
        literal: '4',
      } as Token);
      const expectedResult = {
        type: 'ExpressionStatement',
        expression: {
          type: 'LiteralExpression',
          literal: '4',
          value: 4,
        },
      };
      expect(result).to.deep.equal(expectedResult);
    });
  });

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
