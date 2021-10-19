import { evaluate, Environment } from './evaluate';
import { ReturnStatement } from '../parser/parse-return-statement';

export function evaluateReturnStatement(
  node: ReturnStatement,
  context: Environment
) {
  return evaluate(node.value, context);
}
