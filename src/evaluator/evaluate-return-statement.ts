import { evaluate, Environment } from './evaluate';

export function evaluateReturnStatement(node, context: Environment) {
  return evaluate(node.value, context);
}
