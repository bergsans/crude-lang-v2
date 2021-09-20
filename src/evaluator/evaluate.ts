import { NIL } from '../lexer/token-types';
import { Expression, getValueFromLiteral, NodeTree } from '../parser/parse';
import { isNodeType, isOperatorType } from '../utils/predicates';

const arithmetics = {
  PLUS: (a: number, b: number) => a + b,
  MINUS: (a: number, b: number) => a - b,
  MULTIPLICATION: (a: number, b: number) => a * b,
};

const logic = {
  AND: (a: boolean, b: boolean) => a && b,
  OR: (a: boolean, b: boolean) => a || b,
  NOT: (a: boolean) => !a,
};

const comparators = {
  GREATER_THAN: (a: number, b: number) => a > b,
  LOWER_THAN: (a: number, b: number) => a < b,
  GREATER_THAN_OR_EQUAL: (a: number, b: number) => a >= b,
  LOWER_THAN_OR_EQUAL: (a: number, b: number) => a <= b,
  EQUAL: <T>(a: T, b: T) => a === b,
  NOT_EQUAL: <T>(a: T, b: T) => a !== b,
};

// own file
const operations = { ...arithmetics, ...comparators, ...logic };

export function evaluateBinaryExpression(node: NodeTree) {
  if (!node.left) {
    return getValueFromLiteral[node.value.type](node.value.literal);
  }
  if (isOperatorType(node.value.type)) {
    return operations[node.value.type](
      evaluateBinaryExpression(node.left as NodeTree),
      evaluateBinaryExpression(node.right as NodeTree)
    );
  }
}

const getValueFromUnaryExpression = {
  NOT: (node: Expression) => !evaluate(node.argument),
  MINUS: (node: Expression) => -evaluate(node.argument),
  PLUS: (node: Expression) => +evaluate(node.argument),
};

export function evaluate(node: Expression) {
  if (isNodeType(node, 'UnaryExpression')) {
    return getValueFromUnaryExpression[node.literal](node);
  }
  if (isNodeType(node, 'BinaryExpression')) {
    return evaluateBinaryExpression(node);
  }
  if (['BOOLEAN', 'INTEGER'].includes(node.expression.type)) {
    return getValueFromLiteral[node.expression.type](node.expression.literal);
  }
  if (['BOOLEAN', 'INTEGER'].includes(node.value.type)) {
    return getValueFromLiteral[node.value.type](node.value.literal);
  }
  return NIL;
}
