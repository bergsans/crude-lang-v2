export type TokenType = string;

type Token = undefined;

type Tokens = Token[];

class UnallowedCharacter extends Error {
  constructor(message: string) {
    super(`${message}`);
    this.name = 'UnallowedCharacter';
  }
}

export function tokenize(input: string): Tokens {
  return [];
}
