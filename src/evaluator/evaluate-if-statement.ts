import { Expression } from '../parser/parse-expression-statement';
import { BlockStatement } from '../parser/parse-block-statement';
import { NIL } from '../lexer/token-types';
import { evaluateBlockStatements } from './evaluate-block-statements';
import { evaluate, Environment } from './evaluate';

export function evaluateIfStatement(
  node: {
    type: string;
    condition: Expression;
    consequence: BlockStatement;
  },
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
