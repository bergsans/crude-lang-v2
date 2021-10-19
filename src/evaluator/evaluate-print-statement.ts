import { Environment } from './environment';
import { evaluate } from './evaluate';
import * as AST from '../parser/AST-types';
import { NIL } from '../lexer/token-types';

export function evaluatePrintStatement(
  node: AST.PrintStatement,
  context: Environment
) {
  console.log(evaluate(node.value, context));
  return NIL;
}
