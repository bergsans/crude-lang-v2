import { UNALLOWED_CHARACTER } from './token-types';
import { Token } from './tokenize';

export function isASCIIAlphabetic(character: string) {
  return character.match(/[a-z]/i);
}

export function isDigit(character: string) {
  return character.match(/[0-9]/);
}

export function isUnallowedCharacter(token: Token) {
  return token.type === UNALLOWED_CHARACTER;
}
