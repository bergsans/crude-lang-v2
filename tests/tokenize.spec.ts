import { expect } from 'chai';
import { Token, tokenize } from '../src/lexer/tokenize';

describe('Lexer', () => {
  describe('Without Metadata', () => {
    it('Some random snippets', () => {
      const codeSnippet1 = `
let num = 444;
`;
      const codeSnippet2 = `
let numOne = 2 + 2 + (3 - 3);
let numTwo = 333;
`;
      const codeSnippet3 = `
let numOne =2 + 2 + (3 - 3);
let numTwo =333;
`;
      const expectedRes1 = [
        { type: 'LET', literal: 'let' },
        { type: 'Identifier', literal: 'num' },
        { type: 'ASSIGN', literal: '=' },
        { type: 'Integer', literal: '444' },
        { type: 'SEMICOLON', literal: ';' },
        { type: 'EOF', literal: '\u0000' },
      ];
      const expectedRes2 = [
        { type: 'LET', literal: 'let' },
        { type: 'Identifier', literal: 'numOne' },
        { type: 'ASSIGN', literal: '=' },
        { type: 'Integer', literal: '2' },
        { type: 'PLUS', literal: '+' },
        { type: 'Integer', literal: '2' },
        { type: 'PLUS', literal: '+' },
        { type: 'L_PAREN', literal: '(' },
        { type: 'Integer', literal: '3' },
        { type: 'MINUS', literal: '-' },
        { type: 'Integer', literal: '3' },
        { type: 'R_PAREN', literal: ')' },
        { type: 'SEMICOLON', literal: ';' },
        { type: 'LET', literal: 'let' },
        { type: 'Identifier', literal: 'numTwo' },
        { type: 'ASSIGN', literal: '=' },
        { type: 'Integer', literal: '333' },
        { type: 'SEMICOLON', literal: ';' },
        { type: 'EOF', literal: '\u0000' },
      ];
      const expectedRes3 = expectedRes2;
      [
        [codeSnippet1, expectedRes1],
        [codeSnippet2, expectedRes2],
        [codeSnippet3, expectedRes3],
      ].forEach(([code, res]: [string, Token[]]) => {
        const tokensWithoutMetadata = tokenize(code).map(
          ({ type, literal }: Partial<Token>) => ({
            type,
            literal,
          })
        );
        expect(tokensWithoutMetadata).to.deep.equal(res);
      });
    });
  });
  describe('With Metadata', () => {
    it('Some random snippets', () => {
      const codeSnippet1 = 'let num = 444;';
      const tokens = tokenize(codeSnippet1);
      const res = [
        {
          type: 'LET',
          literal: 'let',
          meta: { ln: 1, col: 1, realPosition: 0 },
        },
        {
          type: 'Identifier',
          literal: 'num',
          meta: { ln: 1, col: 5, realPosition: 4 },
        },
        {
          type: 'ASSIGN',
          literal: '=',
          meta: { ln: 1, col: 9, realPosition: 8 },
        },
        {
          type: 'Integer',
          literal: '444',
          meta: { ln: 1, col: 11, realPosition: 10 },
        },
        {
          type: 'SEMICOLON',
          literal: ';',
          meta: { ln: 1, col: 14, realPosition: 13 },
        },
      ];
      expect(tokens).to.deep.equal(res);
    });

    it('Should throw on unallowed token', () => {
      const code = `
let num_1 = 333;
let ?? = 2;
`;
      const expectedErrorMessage = `_ - at line 2, column 8 - is an unvalid character.

? - at line 3, column 5 - is an unvalid character.

? - at line 3, column 6 - is an unvalid character.

`;
      expect(() => tokenize(code)).to.throw(expectedErrorMessage);
    });

    it('Should tokenize EQUAL and NOT_EQUAL', () => {
      const code1 = '4 == 4;';
      const code2 = '4 != 4;';
      const tokens1 = tokenize(code1);
      const tokens2 = tokenize(code2);
      const expectedResult1 = [
        {
          type: 'Integer',
          literal: '4',
          meta: { ln: 1, col: 1, realPosition: 0 },
        },
        {
          type: 'EQUAL',
          literal: '==',
          meta: { ln: 1, col: 3, realPosition: 2 },
        },
        {
          type: 'Integer',
          literal: '4',
          meta: { ln: 1, col: 6, realPosition: 5 },
        },
        {
          type: 'SEMICOLON',
          literal: ';',
          meta: { ln: 1, col: 7, realPosition: 6 },
        },
      ];
      const expectedResult2 = [
        {
          type: 'Integer',
          literal: '4',
          meta: { ln: 1, col: 1, realPosition: 0 },
        },
        {
          type: 'NOT_EQUAL',
          literal: '!=',
          meta: { ln: 1, col: 3, realPosition: 2 },
        },
        {
          type: 'Integer',
          literal: '4',
          meta: { ln: 1, col: 6, realPosition: 5 },
        },
        {
          type: 'SEMICOLON',
          literal: ';',
          meta: { ln: 1, col: 7, realPosition: 6 },
        },
      ];
      expect(tokens1).to.deep.equal(expectedResult1);
      expect(tokens2).to.deep.equal(expectedResult2);
    });
  });
});
