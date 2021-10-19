import { Environment, evaluate } from './evaluate';
import { ConcatStatement } from '../parser/parse-concat-statement';

export function evaluateConcatStatement(
  node: ConcatStatement,
  context: Environment
) {
  const [firstValue, secondValue] = node.args;
  const a = evaluate(firstValue, context);
  const b = evaluate(secondValue, context);
  return [].concat(a, b);
}
