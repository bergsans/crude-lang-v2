import {
  COMMA,
  NUL,
  L_BRACKET,
  R_BRACKET,
  L_BRACE,
  R_BRACE,
  DIVISION,
  BANG,
  AND_SIGN,
  OR_SIGN,
  DISALLOWED_CHARACTER,
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
  RETURN,
  NEW_LINE,
  TAB,
} from '../lexer/token-types';
import { List } from '../utils/list';
import { peekCharacter, Token, NextToken } from '../lexer/tokenize';
import { Expression } from '../parser/parse-expression-statement';
import {
  INFIX_ARITHMETIC_TYPES,
  INFIX_NOT,
  END_OF_STATEMENT,
} from '../parser/parse-types';
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

export function isQuoteSign(character: string) {
  return character.toLowerCase() === '"';
}

export function isDisallowedToken(token: Token) {
  return token.type === DISALLOWED_CHARACTER;
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

export function isBracket(currentCharacter: string) {
  return [L_BRACKET, R_BRACKET].includes(currentCharacter);
}

export function isGroupedExpression(li: List<Token>) {
  return li.isHead('L_PAREN');
}

export function isComma(currentCharacter: string) {
  return currentCharacter === COMMA;
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
    RESERVED_KEYWORD.SET,
    RESERVED_KEYWORD.FALSE,
    RESERVED_KEYWORD.TRUE,
    RESERVED_KEYWORD.DEFINE,
    RESERVED_KEYWORD.SLICE,
    RESERVED_KEYWORD.CONVERT,
    RESERVED_KEYWORD.FOR,
    RESERVED_KEYWORD.CLEAR,
    RESERVED_KEYWORD.SLEEP,
    RESERVED_KEYWORD.PRINT,
    RESERVED_KEYWORD.CHANGE,
    RESERVED_KEYWORD.CONCAT,
    RESERVED_KEYWORD.LENGTH,
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
    [
      isNot,
      isAssign,
      isComma,
      isBracket,
      isBrace,
      isParens,
      isOperator,
      isSemicolon,
    ],
    character
  );
}

export function isPrimitiveAndEndOfStatement(li: List<Token>) {
  return isPrimitive(li) && isPeekToken(li.lookAt(1), END_OF_STATEMENT);
}

export function isArrayIndex(li: List<Token>) {
  return (
    isPeekToken(li.head(), 'Identifier') && li.lookAt(1).type === 'L_BRACKET'
  );
}

export function isArray(li: List<Token>) {
  return isPeekToken(li.head(), 'L_BRACKET');
}

export function isPrimitive(li: List<Token>) {
  return ['Integer', 'Identifier', 'String', 'Boolean'].includes(
    li.head().type
  );
}

export function isInfixNotAndBoolean(li: List<Token>) {
  return isPeekToken(li.head(), INFIX_NOT) && li.lookAt(1).type === 'Boolean';
}

export function isArithmeticInfix(li: List<Token>) {
  return INFIX_ARITHMETIC_TYPES.includes(li.head().type);
}

export function isCallExpression(li: List<Token>) {
  return li.isHead('Identifier') && li.get()[1].type === 'L_PAREN';
}

export function isChangeStatement(li: List<Token>) {
  return li.isHead('CHANGE') && li.get()[1].type === 'L_PAREN';
}

export function isConvertStatement(li: List<Token>) {
  return li.isHead('CONVERT') && li.get()[1].type === 'L_PAREN';
}

export function isForStatement(li: List<Token>) {
  return li.isHead('FOR') && li.get()[1].type === 'L_PAREN';
}

export function isSleepStatement(li: List<Token>) {
  return li.isHead('SLEEP') && li.get()[1].type === 'L_PAREN';
}

export function isClearStatement(li: List<Token>) {
  return li.isHead('CLEAR') && li.get()[1].type === 'L_PAREN';
}

export function isPrintStatement(li: List<Token>) {
  return li.isHead('PRINT') && li.get()[1].type === 'L_PAREN';
}

export function isConcatStatement(li: List<Token>) {
  return li.isHead('CONCAT') && li.get()[1].type === 'L_PAREN';
}

export function isLengthStatement(li: List<Token>) {
  return li.isHead('LENGTH') && li.get()[1].type === 'L_PAREN';
}

export function isSliceStatement(li: List<Token>) {
  return li.isHead('SLICE') && li.get()[1].type === 'L_PAREN';
}

export function isInBinaryExpression(li: List<Token>) {
  let i = 0;
  while (li.get()[i + 2].type !== 'R_PAREN') {
    i++;
  }
  i++;
  if (isOperatorType(li.get()[i + 2].type)) {
    return true;
  }
  return false;
}

export function isInfixNotAndGroupedExpression(li: List<Token>) {
  return isPeekToken(li.head(), INFIX_NOT) && li.lookAt(1).type === 'L_PAREN';
}

export function isArithmeticOperatorAndGroupedExpression(li: List<Token>) {
  return (
    INFIX_ARITHMETIC_TYPES.includes(li.head().type) &&
    li.lookAt(1).type === 'L_PAREN'
  );
}

export function isIdentifierAndEndOfStatement(li: List<Token>) {
  return li.isHead('Identifier') && li.lookAt(1).type === END_OF_STATEMENT;
}

export function isPartOfBinaryExpression(li: List<Token>) {
  return (
    ((isPrimitive(li) || isArrayIndex(li) || isArray(li)) &&
      isOperatorType(li.lookAt(1).type)) ||
    isPeekToken(li.head(), 'L_PAREN') ||
    INFIX_ARITHMETIC_TYPES.includes(li.head().type)
  );
}
