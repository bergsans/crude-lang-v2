import { Environment, evaluate } from './evaluate';

export function evaluateConcatStatement(node, context: Environment) {
  const [firstValue, secondValue] = node.args;
  const a = evaluate(firstValue, context);
  const b = evaluate(secondValue, context);
  return [].concat(a, b);
}
