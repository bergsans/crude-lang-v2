import {
  NUL,
  L_BRACE,
  R_BRACE,
  DIVISION,
  BANG,
  AND_SIGN,
  OR_SIGN,
  UNALLOWED_CHARACTER,
  ASSIGN,
  L_PAREN,
  R_PAREN,
  MINUS,
  PLUS,
  MODULO,
  POWER,
  MULTIPLICATION,
  SEMICOLON,
  GREATER_THAN,
  LOWER_THAN,
  SPACE,
  RETURN_STATEMENT,
  RETURN,
  NEW_LINE,
  TAB,
} from '../lexer/token-types';
import { peekCharacter, Token, NextToken } from '../lexer/tokenize';
import { Expression } from '../parser/parse';
import RESERVED_KEYWORD from '../lexer/reserved-keywords';

type Predicate<T> = (x: T, y?: T) => boolean;
export function isOr<T>(predicates: Predicate<T>[], x: T, y?: T) {
  return predicates.reduce(
    (isTrue: boolean, pred: Predicate<T>) =>
      !isTrue ? (y ? pred(x as T, y as T) : pred(x as T)) : true,
    false
  );
}

export function isWhitespace(character: string) {
  return [SPACE, RETURN, NEW_LINE, TAB].includes(character);
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

export function isBrace(currentCharacter: string) {
  return [L_BRACE, R_BRACE].includes(currentCharacter);
}
export function isParens(currentCharacter: string) {
  return [L_PAREN, R_PAREN].includes(currentCharacter);
}

export function isOperator(currentCharacter: string) {
  return [MINUS, PLUS, MULTIPLICATION, DIVISION, MODULO, POWER].includes(
    currentCharacter
  );
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
  'MODULO',
  'POWER',
  'DIVISION',
  'PLUS',
  'MINUS',
  'MULTIPLICATION',
  'AND',
  'OR'
);

export function isNUL(character: string) {
  return character === NUL;
}

export function isReservedKeyword(nextToken: NextToken) {
  return [
    RESERVED_KEYWORD.LET,
    RESERVED_KEYWORD.FALSE,
    RESERVED_KEYWORD.TRUE,
    RESERVED_KEYWORD.IF,
    RESERVED_KEYWORD.RETURN,
  ].includes(nextToken.name);
}

export function isIdentifier(nextToken: NextToken) {
  return typeof nextToken.name === 'string';
}

export function isComparisonOperator(
  character: string,
  input: string,
  nextPosition: number
) {
  return isOr(
    [
      isNotEqual,
      isEqual,
      isAndSign,
      isOrSign,
      isGreaterThanOrEqual,
      isLowerThanOrEqual,
      isGreaterThan,
      isLowerThan,
    ],
    character,
    peekCharacter(input, nextPosition)
  );
}

export function isSingleSign(character: string) {
  return isOr(
    [isNot, isAssign, isBrace, isParens, isOperator, isSemicolon],
    character
  );
}
