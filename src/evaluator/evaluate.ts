import { NodeTree } from '../parser/parse';
import { isOperatorType } from '../utils/predicates';

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
};

const operations = { ...arithmetics, ...logic };

const getValueFromLiteral = {
  BOOLEAN: (literal: string) => (literal === 'true' ? true : false),
  INTEGER: (literal: string) => parseInt(literal, 10),
};

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
