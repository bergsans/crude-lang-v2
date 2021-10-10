import { Token } from '../lexer/tokenize';
import { UnaryExpression, INFIX_NOT } from './parse-types';
import { isInBinaryExpression } from '../utils/predicates';
import { List } from '../utils/list';
import {
  _parseBinaryExpression,
  parseCallExpression,
  parseSliceStatement,
  parseLengthStatement,
  parseLiteralExpression,
  parseExpressionStatement,
} from './parse';

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
