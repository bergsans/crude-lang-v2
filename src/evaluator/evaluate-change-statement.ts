import { Environment } from './environment';
import { evaluate } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateChangeStatement(
  node: AST.ChangeStatement,
  context: Environment
) {
  const array = evaluate(node.array, context);
  const index = evaluate(node.index, context);
  const value = evaluate(node.newValue, context);
  array[index] = value;
  return array;
}
