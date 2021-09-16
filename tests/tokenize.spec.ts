import { expect } from 'chai';
import { Token, Tokens, tokenize } from '../src/tokenize/tokenize';

describe('Tokenizer', () => {
  it('#tokenize (without metadata)', () => {
    const codeSnippet1 = `
let num = 444;
`;
    const codeSnippet2 = `
let numOne = 2;
let numTwo = 333;
`;
    const codeSnippet3 = `
let numOne= 2;
let numTwo =333;
`;
    const expectedRes1 = [
      { type: 'LET', literal: 'let' },
      { type: 'IDENTIFIER', literal: 'num' },
      { type: '=', literal: '=' },
      { type: 'INTEGER', literal: '444' },
      { type: ';', literal: ';' },
      { type: 'EOF', literal: '\u0000' },
    ];
    const expectedRes2 = [
      { type: 'LET', literal: 'let' },
      { type: 'IDENTIFIER', literal: 'numOne' },
      { type: '=', literal: '=' },
      { type: 'INTEGER', literal: '2' },
      { type: ';', literal: ';' },
      { type: 'LET', literal: 'let' },
      { type: 'IDENTIFIER', literal: 'numTwo' },
      { type: '=', literal: '=' },
      { type: 'INTEGER', literal: '333' },
      { type: ';', literal: ';' },
      { type: 'EOF', literal: '\u0000' },
    ];
    const expectedRes3 = expectedRes2;
    [
      [codeSnippet1, expectedRes1],
      [codeSnippet2, expectedRes2],
      [codeSnippet3, expectedRes3],
    ].forEach(([code, res]: [string, Tokens]) => {
      const tokensWithoutMetadata = tokenize(code).map(
        ({ type, literal }: Partial<Token>) => ({
          type,
          literal,
        })
      );
      expect(tokensWithoutMetadata).to.deep.equal(res);
    });
  });

  it('#tokenize (with metadata)', () => {
    const codeSnippet1 = 'let num = 444;';
    const tokens = tokenize(codeSnippet1);
    const res = [
      {
        type: 'LET',
        literal: 'let',
        meta: { ln: 1, col: 1, realPosition: 0 },
      },
      {
        type: 'IDENTIFIER',
        literal: 'num',
        meta: { ln: 1, col: 5, realPosition: 4 },
      },
      { type: '=', literal: '=', meta: { ln: 1, col: 9, realPosition: 8 } },
      {
        type: 'INTEGER',
        literal: '444',
        meta: { ln: 1, col: 11, realPosition: 10 },
      },
      {
        type: ';',
        literal: ';',
        meta: { ln: 1, col: 14, realPosition: 13 },
      },
    ];
    expect(tokens).to.deep.equal(res);
  });
});
