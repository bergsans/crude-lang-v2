import { evaluate, Environment } from './evaluate';

export function evaluateChangeStatement(node, context: Environment) {
  const array = evaluate(node.array, context);
  const index = evaluate(node.index, context);
  const value = evaluate(node.newValue, context);
  array[index] = value;
  return array;
}
