import { tokenize } from '../src/tokenize';

test('#tokenize', () => {
  console.log('test starts');
  const code = `
let a = 4;
`;
  expect(tokenize(code)).toBe([
    { type: 'LET', literal: 'let' },
    { type: 'IDENTIFIER', literal: 'a' },
    { type: 'ASSIGN', literal: '=' },
    { type: 'INTEGER', literal: '4' },
    { type: 'SEMICOLON', literal: ';' },
  ]);
});
