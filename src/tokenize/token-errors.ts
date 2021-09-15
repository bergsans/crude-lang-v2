import { Token } from './tokenize';

class TokenizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenizeError';
  }
}

export function throwNoInput() {
  throw new TokenizeError('No input');
}

export function throwUnallowedCharacter(unallowedCharacter: Token) {
  throw new TokenizeError(
    `${unallowedCharacter.literal} is an unvalid character.`
  );
}
