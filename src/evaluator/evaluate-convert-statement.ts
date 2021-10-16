import { evaluate, Environment } from './evaluate';

export function evaluateConvertStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  return typeof value === 'string' ? parseInt(value, 10) : value.toString();
}
