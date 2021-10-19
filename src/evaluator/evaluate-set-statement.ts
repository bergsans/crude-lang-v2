import { NIL } from '../lexer/token-types';
import * as AST from '../parser/AST-types';
import { Environment } from './environment';
import { evaluate } from './evaluate';

export function evaluateSetStatement(
  node: AST.SetStatement,
  context: Environment
) {
  const value = evaluate(node.statement, context);
  context.set(node.id.name, value);
  return NIL;
}
