import { evaluate, Environment } from './evaluate';
import { NIL } from '../lexer/token-types';
import * as AST from '../parser/AST-types';
import { evaluateBlockStatements } from './evaluate-block-statements';

export function evaluateForStatement(
  node: AST.ForStatement,
  context: Environment
) {
  const id = node.id.name;
  const start = evaluate(node.start, context);
  const end = evaluate(node.end, context);
  for (let i = start; i < end; i++) {
    context.scope[id] = i;
    evaluateBlockStatements(node.action.statements, context);
  }
  return NIL;
}
