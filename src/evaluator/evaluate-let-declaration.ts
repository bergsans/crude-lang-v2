import { NIL } from '../lexer/token-types';
import { evaluate, Environment } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateLetDeclaration(
  node: AST.LetDeclaration,
  context: Environment
) {
  const value = evaluate(node.statement, context);
  context.scope[node.id.name] = value;
  return NIL;
}
