import { evaluate, Environment } from './evaluate';
import { PrintStatement } from '../parser/parse-print-statement';
import { NIL } from '../lexer/token-types';

export function evaluatePrintStatement(
  node: PrintStatement,
  context: Environment
) {
  console.log(evaluate(node.value, context));
  return NIL;
}
