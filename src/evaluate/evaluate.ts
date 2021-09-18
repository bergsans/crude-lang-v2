import { NodeTree } from '../parser/parse';
import { isOperatorType } from '../utils/predicates';

const arithmetics = {
  PLUS: (a: number, b: number) => a + b,
  MINUS: (a: number, b: number) => a - b,
  MULTIPLICATION: (a: number, b: number) => a * b,
  EQUAL: (a: number, b: number) => a === b,
  NOT_EQUAL: (a: number, b: number) => a !== b,
  GT: (a: number, b: number) => a > b,
  LT: (a: number, b: number) => a < b,
};

export function evaluateBinaryExpression(node: NodeTree) {
  if (!node.left) {
    return parseInt(node.value.literal, 10);
  }
  if (isOperatorType(node.value.type)) {
    return arithmetics[node.value.type](
      evaluateBinaryExpression(node.left as NodeTree),
      evaluateBinaryExpression(node.right as NodeTree)
    );
  }
}
