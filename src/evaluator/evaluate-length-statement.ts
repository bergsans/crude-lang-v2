import { Environment, evaluate } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateLengthStatement(
  node: AST.LengthStatement,
  context: Environment
) {
  const value = evaluate(node.value, context);
  return value.length;
}
