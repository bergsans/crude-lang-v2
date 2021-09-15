import { tokenize } from '../src/tokenize';

test('#tokenize', () => {
  const code = `
let a = 4;
`;
  expect(tokenize(code)).toBe([]);
});
