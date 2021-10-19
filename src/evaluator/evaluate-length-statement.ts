import { Environment, evaluate } from './evaluate';
import { LengthStatement } from '../parser/parse-length-statement';

export function evaluateLengthStatement(
  node: LengthStatement,
  context: Environment
) {
  const value = evaluate(node.value, context);
  return value.length;
}
