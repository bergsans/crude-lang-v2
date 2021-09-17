import { NodeTree } from '../parser/parse';
import { characterNames, PLUS, MULTIPLICATION } from '../lexer/token-types';

export function evaluateBinaryExpression(node: NodeTree) {
  if (!node.left) {
    return parseInt(node.value.literal, 10);
  }
  if (node.value.type === characterNames[PLUS]) {
    return (
      evaluateBinaryExpression(node.left as NodeTree) +
      evaluateBinaryExpression(node.right as NodeTree)
    );
  }
  if (node.value.type === characterNames[MULTIPLICATION]) {
    return (
      evaluateBinaryExpression(node.left as NodeTree) *
      evaluateBinaryExpression(node.right as NodeTree)
    );
  }
}
