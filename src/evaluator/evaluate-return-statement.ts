import { Environment } from './environment';
import { evaluate } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateReturnStatement(
  node: AST.ReturnStatement,
  context: Environment
) {
  return evaluate(node.value, context);
}
