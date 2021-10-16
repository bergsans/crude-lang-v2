import { Environment, evaluate } from './evaluate';

export function evaluateLengthStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  return value.length;
}
