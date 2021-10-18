import { evaluate, Environment } from './evaluate';
import { NIL } from '../lexer/token-types';

export function evaluatePrintStatement(node, context: Environment) {
  console.log(evaluate(node.value, context));
  return NIL;
}
