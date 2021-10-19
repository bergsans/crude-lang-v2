import { NIL } from '../lexer/token-types';
import { Environment } from './environment';
import * as AST from '../parser/AST-types';
import { evaluateBlockStatements } from './evaluate-block-statements';
import { evaluate } from './evaluate';

export function evaluateIfStatement(
  node: AST.IfStatement,
  context: Environment
) {
  const condition = evaluate(node.condition, context);
  if (condition) {
    return node.consequence.statements.length > 0
      ? evaluateBlockStatements(node.consequence.statements, context)
      : NIL;
  }
  return NIL;
}
