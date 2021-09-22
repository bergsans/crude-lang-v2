import { NIL } from '../lexer/token-types';
import RESERVED_KEYWORDS from '../lexer/reserved-keywords';
import { Expression, NodeTree } from '../parser/parse';
import {
  UnaryExpression,
  BinaryExpression,
  ExpressionStatement,
  LITERAL_PRIMITIVES,
} from '../parser/parse-types';
import { isNodeType, isOperatorType } from '../utils/predicates';
import { operations } from './operations';

const evaluateUnaryExpression = {
  NOT: (node: Expression) => !evaluate(node.argument),
  MINUS: (node: Expression) => -evaluate(node.argument),
  PLUS: (node: Expression) => +evaluate(node.argument),
};

const evaluateLiteralExpression = {
  BOOLEAN: (literal: string) => {
    return literal === RESERVED_KEYWORDS.TRUE ? true : false;
  },
  INTEGER: (literal: string) => parseInt(literal, 10),
};

export function evaluateBinaryExpression(node: NodeTree) {
  if (!node.left) {
    return evaluateLiteralExpression[node.value.type](node.value.literal);
  }
  if (isOperatorType(node.value.type)) {
    return operations[node.value.type](
      evaluateBinaryExpression(node.left as NodeTree),
      evaluateBinaryExpression(node.right as NodeTree)
    );
  }
}

export function evaluate(node: Expression) {
  if (isNodeType(node, UnaryExpression)) {
    return evaluateUnaryExpression[node.literal](node);
  }
  if (isNodeType(node, BinaryExpression)) {
    return evaluateBinaryExpression(node);
  }
  if (isNodeType(node, ExpressionStatement)) {
    return evaluateLiteralExpression[node.expression.type](
      node.expression.literal
    );
  }
  if (LITERAL_PRIMITIVES.includes(node.value.type)) {
    return evaluateLiteralExpression[node.value.type](node.value.literal);
  }
  if (node.expression) return NIL;
}
