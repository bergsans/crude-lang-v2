import { List } from '../utils/list';
import { parseConvertStatement } from './parse-convert-statement';
import { INFIX_NOT } from './parse-types';
import { isInBinaryExpression } from '../utils/predicates';
import { fmtStr } from 'crude-dev-tools';
import { parseCallExpression } from './parse-call-expression';
import { parseConcatStatement } from './parse-concat-statement';
import { Node } from './parse';
import { parseSliceStatement } from './parse-slice-statement';
import { parseLengthStatement } from './parse-length-statement';
import { _parseBinaryExpression } from './parse-binary-expression';
import { Token } from '../lexer/tokenize';
import { NIL } from '../lexer/token-types';
import {
  isArithmeticOperatorAndGroupedExpression,
  isPrimitiveAndEndOfStatement,
  isPartOfBinaryExpression,
  isIdentifierAndEndOfStatement,
  isSliceStatement,
  isArray,
  isArrayIndex,
  isConvertStatement,
  isChangeStatement,
  isConcatStatement,
  isLengthStatement,
  isCallExpression,
  isPrimitive,
  isInfixNotAndBoolean,
  isInfixNotAndGroupedExpression,
} from '../utils/predicates';
import { parseChangeStatement } from './parse-change-statement';
import { parseLiteralExpression } from './parse-literal-expression';

export interface ArrayElement {
  type: 'ELEMENT';
  collection: Token;
  index: number;
}

export interface Array {
  type: 'ARRAY';
  elements: ArrayElement[];
}

export interface Expression extends Node {
  type: 'Expression';
  literal: string;
  expression: Expression;
  argument?: Expression;
}

export interface UnaryExpression extends Omit<Expression, 'type'> {
  type: 'UnaryExpression';
}

type ParseExpressionPredicate = (li: List<Token>) => boolean;

type ParseExpressionProducer = any; // Fix node types

type ParseExpressionHandler = [
  ParseExpressionPredicate,
  ParseExpressionProducer
];

function produceArray(li: List<Token>) {
  li.next();
  const elements = [];
  while (!li.isHead('R_BRACKET')) {
    const expression = parseExpressionStatement(li);
    elements.push(expression);
    if (li.isHead('COMMA')) {
      li.next();
    }
  }
  li.next();
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'ARRAY',
    elements,
  };
}

function produceBinaryExpression(li: List<Token>) {
  return _parseBinaryExpression(li);
}

function produceArrayIndex(li: List<Token>) {
  const collection = li.next();
  if (!li.isHead('L_BRACKET')) {
    throw new Error(fmtStr('Expected opening bracket.', 'red'));
  }
  li.next();
  const index = parseExpressionStatement(li);
  if (!li.isHead('R_BRACKET')) {
    throw new Error(fmtStr('Expected closing bracket.', 'red'));
  }
  li.next();
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'ELEMENT',
    collection,
    index,
  };
}

function produceConcatStatement(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    const expression = _parseBinaryExpression(li);
    return expression;
  }
  const expression = parseConcatStatement(li);
  li.next();
  return expression;
}

function produceLengthStatement(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    const expression = _parseBinaryExpression(li);
    return expression;
  }
  const expression = parseLengthStatement(li);
  li.next();
  return expression;
}

function produceSliceStatement(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    return _parseBinaryExpression(li);
  }
  const expression = parseSliceStatement(li);
  li.next();
  return expression;
}

function produceCallExpression(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    return _parseBinaryExpression(li);
  }
  const callExpression = parseCallExpression(li);
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return callExpression;
}

function produceInfixNotAndBoolean(li: List<Token>) {
  li.next();
  return {
    type: 'UnaryExpression',
    literal: INFIX_NOT,
    argument: parseExpressionStatement(li),
  };
}

function produceInfixNotAndGroupedExpression(li: List<Token>) {
  li.next();
  return {
    type: 'UnaryExpression',
    literal: INFIX_NOT,
    argument: parseExpressionStatement(li),
  };
}

function produceArithmeticOperatorAndGroupedExpression(li: List<Token>) {
  const type = li.head().type;
  li.next();
  return {
    type: 'UnaryExpression',
    literal: type,
    argument: parseExpressionStatement(li),
  };
}

function producePrimitive(li: List<Token>) {
  const currentToken = li.next();
  return parseLiteralExpression(currentToken);
}

function produceIdentifierAndEndOfStatement(li: List<Token>) {
  const currentToken = li.next();
  li.next();
  return {
    type: 'Identifier',
    name: currentToken.literal,
  };
}

function producePrimitiveAndEndOfStatement(li: List<Token>) {
  const currentToken = li.next();
  li.next();
  return parseLiteralExpression(currentToken);
}

const parseExpressionHandlers: ParseExpressionHandler[] = [
  [isSliceStatement, produceSliceStatement],
  [isConvertStatement, parseConvertStatement],
  [isChangeStatement, parseChangeStatement],
  [isConcatStatement, produceConcatStatement],
  [isLengthStatement, produceLengthStatement],
  [isArrayIndex, produceArrayIndex],
  [isArray, produceArray],
  [isCallExpression, produceCallExpression],
  [isPrimitiveAndEndOfStatement, producePrimitiveAndEndOfStatement],
  [isInfixNotAndBoolean, produceInfixNotAndBoolean],
  [isInfixNotAndGroupedExpression, produceInfixNotAndGroupedExpression],
  [
    isArithmeticOperatorAndGroupedExpression,
    produceArithmeticOperatorAndGroupedExpression,
  ],
  [isPartOfBinaryExpression, produceBinaryExpression],
  [isPrimitive, producePrimitive],
  [isIdentifierAndEndOfStatement, produceIdentifierAndEndOfStatement],
];

export function parseExpressionStatement(li: List<Token>): Expression {
  for (const [predicate, producer] of parseExpressionHandlers) {
    if (predicate(li)) {
      return producer(li);
    }
  }
  return NIL;
}
