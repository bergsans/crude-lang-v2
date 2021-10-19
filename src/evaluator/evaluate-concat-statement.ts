import { Environment, evaluate } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateConcatStatement(
  node: AST.ConcatStatement,
  context: Environment
) {
  const [firstValue, secondValue] = node.args;
  const a = evaluate(firstValue, context);
  const b = evaluate(secondValue, context);
  return [].concat(a, b);
}
