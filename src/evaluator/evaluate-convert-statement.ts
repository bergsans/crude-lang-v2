import { evaluate, Environment } from './evaluate';
import { ConvertStatement } from '../parser/parse-convert-statement';

export function evaluateConvertStatement(
  node: ConvertStatement,
  context: Environment
) {
  const value = evaluate(node.value, context);
  return typeof value === 'string' ? parseInt(value, 10) : value.toString();
}
