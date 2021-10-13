import { Token } from '../lexer/tokenize';
import { UnaryExpression, INFIX_NOT } from './parse-types';
import { isInBinaryExpression } from '../utils/predicates';
import { fmtStr } from 'crude-dev-tools';
import { List } from '../utils/list';
import {
  _parseBinaryExpression,
  parseCallExpression,
  parseConcatStatement,
  parseSliceStatement,
  parseLengthStatement,
  parseLiteralExpression,
  parseExpressionStatement,
} from './parse';

export function produceArray(li: List<Token>) {
  li.next();
  const elements = [];
  while (li.head().type !== 'R_BRACKET') {
    const expression = parseExpressionStatement(li);
    elements.push(expression);
    if (li.head().type === 'COMMA') {
      li.next();
    }
  }
  li.next();
  if (li.head().type === 'SEMICOLON') {
    li.next();
  }
  return {
    type: 'ARRAY',
    elements,
  };
}

export function produceArrayIndex(li: List<Token>) {
  const collection = li.next();
  if (li.head().type !== 'L_BRACKET') {
    throw new Error(fmtStr('Expected opening bracket.', 'red'));
  }
  li.next();
  const index = parseExpressionStatement(li);
  if (li.head().type !== 'R_BRACKET') {
    throw new Error(fmtStr('Expected closing bracket.', 'red'));
  }
  li.next();
  if (li.head().type === 'SEMICOLON') {
    li.next();
  }
  return {
    type: 'ELEMENT',
    collection,
    index,
  };
}

export function produceConcatStatement(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    const expression = _parseBinaryExpression(li);
    return expression;
  }
  const expression = parseConcatStatement(li);
  li.next();
  return expression;
}

export function produceLengthStatement(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    const expression = _parseBinaryExpression(li);
    return expression;
  }
  const expression = parseLengthStatement(li);
  li.next();
  return expression;
}

export function produceSliceStatement(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    return _parseBinaryExpression(li);
  }
  const expression = parseSliceStatement(li);
  li.next();
  return expression;
}

export function produceCallExpression(li: List<Token>) {
  if (isInBinaryExpression(li)) {
    return _parseBinaryExpression(li);
  }
  const callExpression = parseCallExpression(li);
  if (li.head().type === 'SEMICOLON') {
    li.next();
  }
  return callExpression;
}

export function producePrimitiveAndEndOfStatement(li: List<Token>) {
  const currentToken = li.next();
  li.next();
  return parseLiteralExpression(currentToken);
}

export function produceInfixNotAndBoolean(li: List<Token>) {
  li.next();
  return {
    type: UnaryExpression,
    literal: INFIX_NOT,
    argument: parseExpressionStatement(li),
  };
}

export function produceInfixNotAndGroupedExpression(li: List<Token>) {
  li.next();
  return {
    type: UnaryExpression,
    literal: INFIX_NOT,
    argument: parseExpressionStatement(li),
  };
}

export function produceArithmeticOperatorAndGroupedExpression(li: List<Token>) {
  const type = li.head().type;
  li.next();
  return {
    type: UnaryExpression,
    literal: type,
    argument: parseExpressionStatement(li),
  };
}

export function producePrimitive(li: List<Token>) {
  const currentToken = li.next();
  return parseLiteralExpression(currentToken);
}

export function produceIdentifierAndEndOfStatement(li: List<Token>) {
  const currentToken = li.next();
  li.next();
  return {
    type: 'Identifier',
    name: currentToken.literal,
  };
}
