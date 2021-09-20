import { NIL } from '../lexer/token-types';
import { Expression, getValueFromLiteral, NodeTree } from '../parser/parse';
import { isNodeType, isOperatorType } from '../utils/predicates';

const arithmetics = {
  PLUS: (a: number, b: number) => a + b,
  MINUS: (a: number, b: number) => a - b,
  MULTIPLICATION: (a: number, b: number) => a * b,
  GREATER_THAN: (a: number, b: number) => a > b,
  LOWER_THAN: (a: number, b: number) => a < b,
  GREATER_THAN_OR_EQUAL: (a: number, b: number) => a >= b,
  LOWER_THAN_OR_EQUAL: (a: number, b: number) => a <= b,
};

const logic = {
  EQUAL: <T>(a: T, b: T) => a === b,
  NOT_EQUAL: <T>(a: T, b: T) => a !== b,
  AND: (a: boolean, b: boolean) => a && b,
  OR: (a: boolean, b: boolean) => a || b,
  NOT: (a: boolean) => !a,
};

const operations = { ...arithmetics, ...logic };

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
  NOT: (node: Expression) => !node.argument.expression.value,
  MINUS: (node: Expression) => -parseInt(node.argument.value.literal, 10),
};

export function evaluate(node: Expression) {
  if (isNodeType(node, 'UnaryExpression')) {
    return node.literal === 'NOT'
      ? !evaluate(node.argument)
      : -evaluate(node.argument);
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
