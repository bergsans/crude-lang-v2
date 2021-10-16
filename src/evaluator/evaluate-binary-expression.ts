import { NIL } from '../lexer/token-types';
import { Environment, evaluate } from './evaluate';
import { NodeTree } from '../parser/parse-binary-expression';
import { isOperatorType } from '../utils/predicates';
import { operations } from './operations';
import { evaluateLiteralExpression } from './evaluate-literal-expression';

export function evaluateBinaryExpression(node: NodeTree, context: Environment) {
  if (!node.left) {
    if (
      [
        'ConcatStatement',
        'ChangeStatement',
        'ConvertStatement',
        'LengthStatement',
        'SliceStatement',
        'CallExpression',
      ].includes(node.value.type)
    ) {
      return evaluate(node.value, context);
    }
    return evaluateLiteralExpression[node.value.type](
      node.value.literal,
      context
    );
  }
  if (isOperatorType(node.value.type)) {
    return operations[node.value.type](
      evaluateBinaryExpression(node.left as NodeTree, context),
      evaluateBinaryExpression(node.right as NodeTree, context)
    );
  }
  return NIL;
}
