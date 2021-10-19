import { IfStatement } from '../parser/parse-if-statement';
import { NIL } from '../lexer/token-types';
import { evaluateBlockStatements } from './evaluate-block-statements';
import { evaluate, Environment } from './evaluate';

export function evaluateIfStatement(node: IfStatement, context: Environment) {
  const condition = evaluate(node.condition, context);
  if (condition) {
    return node.consequence.statements.length > 0
      ? evaluateBlockStatements(node.consequence.statements, context)
      : NIL;
  }
  return NIL;
}
