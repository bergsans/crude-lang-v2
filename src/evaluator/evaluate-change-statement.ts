import { evaluate, Environment } from './evaluate';
import { ChangeStatement } from '../parser/parse-change-statement';

export function evaluateChangeStatement(
  node: ChangeStatement,
  context: Environment
) {
  const array = evaluate(node.array, context);
  const index = evaluate(node.index, context);
  const value = evaluate(node.newValue, context);
  array[index] = value;
  return array;
}
