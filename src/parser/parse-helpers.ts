import { Token } from '../lexer/tokenize';
import { UnaryExpression, INFIX_NOT } from './parse-types';
import { isInBinaryExpression } from '../utils/predicates';
import { List } from '../utils/list';
import {
  _parseBinaryExpression,
  parseCallExpression,
  parseSliceStatement,
  //  parsePrintStatement,
  parseLengthStatement,
  parseLiteralExpression,
  parseExpressionStatement,
} from './parse';

//export function producePrintStatement(li: List<Token>) {
//const expression = parsePrintStatement(li);
//li.next();
//return expression;
//}

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
    throw new Error('Expected opening bracket.');
  }
  li.next();
  const index = parseExpressionStatement(li);
  if (li.head().type !== 'R_BRACKET') {
    throw new Error('Expected closing bracket.');
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
  li.next();
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
