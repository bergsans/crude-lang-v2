import {
  BANG,
  AND_SIGN,
  OR_SIGN,
  UNALLOWED_CHARACTER,
  ASSIGN,
  L_PAREN,
  R_PAREN,
  MINUS,
  PLUS,
  MULTIPLICATION,
  SEMICOLON,
  GREATER_THAN,
  LOWER_THAN,
} from '../lexer/token-types';
import { Token } from '../lexer/tokenize';
import { Expression } from '../parser/parse';

type Predicate<T> = (x: T, y?: T) => boolean;
export function isOr<T>(predicates: Predicate<T>[], x: T, y?: T) {
  return y
    ? predicates.reduce(
        (isTrue: boolean, pred: Predicate<T>) =>
          !isTrue ? pred(x as T, y as T) : true,
        false
      )
    : predicates.reduce(
        (isTrue: boolean, pred: Predicate<T>) =>
          !isTrue ? pred(x as T) : true,
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

export function isAndSign(currentCharacter: string, nextCharacter: string) {
  return currentCharacter === nextCharacter && currentCharacter === AND_SIGN;
}

export function isOrSign(currentCharacter: string, nextCharacter: string) {
  return currentCharacter === nextCharacter && currentCharacter === OR_SIGN;
}

export function isGreaterThan(currentCharacter: string) {
  return currentCharacter === GREATER_THAN;
}

export function isLowerThan(currentCharacter: string) {
  return currentCharacter === LOWER_THAN;
}

export function isGreaterThanOrEqual(
  currentCharacter: string,
  nextCharacter: string
) {
  return currentCharacter === GREATER_THAN && nextCharacter === ASSIGN;
}

export function isLowerThanOrEqual(
  currentCharacter: string,
  nextCharacter: string
) {
  return currentCharacter === LOWER_THAN && nextCharacter === ASSIGN;
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

export function isNot(currentCharacter: string) {
  return currentCharacter === BANG;
}

export function isOfType(...types: string[]) {
  return function (type: string) {
    return types.includes(type);
  };
}

export function isNodeType(node: Expression, ofType: string) {
  return node.type === ofType;
}

export const isOperatorType = isOfType(
  'EQUAL',
  'NOT_EQUAL',
  'GREATER_THAN',
  'LOWER_THAN',
  'LOWER_THAN_OR_EQUAL',
  'GREATER_THAN_OR_EQUAL',
  'PLUS',
  'MINUS',
  'MULTIPLICATION',
  'AND',
  'OR'
);
