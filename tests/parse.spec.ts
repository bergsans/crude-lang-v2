import { expect } from 'chai';
import { Tokens, Token, tokenize } from '../src/lexer/tokenize';
import {
  parseLetStatement,
  parseLiteralExpression,
  _parseBinaryExpression,
} from '../src/parser/parse';

describe('ExpressionStatement', () => {
  describe('Integer', () => {
    it('4;', () => {
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

  describe('LetDeclaration', () => {
    it('let x = 4;', () => {
      const code = 'let x = 4;';
      const tokens = tokenize(code).slice(1); // remove 'let'
      const result = parseLetStatement(tokens);
      const expectedResult = {
        type: 'LetDeclaration',
        id: {
          type: 'IDENTIFIER',
          name: 'x',
        },
        expression: {
          type: 'ExpressionStatement',
          expression: {
            type: 'LiteralExpression',
            literal: '4',
            meta: {
              ln: 1,
              col: 9,
              realPosition: 8,
            },
            value: 4,
          },
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
