import { UNALLOWED_CHARACTER } from '../lexer/token-types';
import { Token } from '../lexer/tokenize';

export function isPeekToken(token: Token, tokenType: string) {
  return token.type === tokenType;
}

export function isASCIIAlphabetic(character: string) {
  return /[a-z]/i.test(character);
}

export function isDigit(character: string) {
  return /[0-9]/.test(character);
}

export function isUnallowedToken(token: Token) {
  return token.type === UNALLOWED_CHARACTER;
}
