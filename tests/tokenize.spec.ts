import { expect } from 'chai';
import { Tokens, tokenize } from '../src/tokenize';

describe('Tokenizer', () => {
  it('#tokenize', () => {
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
      const tokens = tokenize(code);
      console.log(tokens);
      expect(tokens).to.deep.equal(res);
    });
  });
});
