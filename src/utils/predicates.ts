import {
  BANG,
  UNALLOWED_CHARACTER,
  ASSIGN,
  L_PAREN,
  R_PAREN,
  MINUS,
  PLUS,
  MULTIPLICATION,
  SEMICOLON,
} from '../lexer/token-types';
import { Token } from '../lexer/tokenize';

type Predicate<T> = (v: T) => boolean;
export function isOr<T>(predicates: Predicate<T>[], v: T) {
  return predicates.reduce(
    (isTrue: boolean, pred: Predicate<T>) => (!isTrue ? pred(v as T) : true),
    false
  );
}

export function isPeekToken(token: Token, tokenType: string) {
  return token.type === tokenType;
}

export function isASCIIAlphabetic(character: string) {
  return character.toLowerCase() >= 'a' && character.toLowerCase() <= 'z';
}

export function isDigit(character: string) {
  return character >= '0' && character <= '9';
}

export function isUnallowedToken(token: Token) {
  return token.type === UNALLOWED_CHARACTER;
}

export function isEqual(currentCharacter: string, nextCharacter: string) {
  return currentCharacter === nextCharacter && currentCharacter === ASSIGN;
}

export function isNotEqual(currentCharacter: string, nextCharacter: string) {
  return currentCharacter === BANG && nextCharacter === ASSIGN;
}

export function isAssign(currentCharacter: string) {
  return currentCharacter === ASSIGN;
}

export function isParens(currentCharacter: string) {
  return [L_PAREN, R_PAREN].includes(currentCharacter);
}

export function isOperator(currentCharacter: string) {
  return [MINUS, PLUS, MULTIPLICATION].includes(currentCharacter);
}

export function isSemicolon(currentCharacter: string) {
  return currentCharacter === SEMICOLON;
}

export function isBang(currentCharacter: string) {
  return currentCharacter === BANG;
}

export function isOfType(...types: string[]) {
  return function (type: string) {
    return types.includes(type);
  };
}

export const isOperatorType = isOfType(
  'EQUAL',
  'NOT_EQUAL',
  'PLUS',
  'MINUS',
  'MULTIPLICATION'
);
