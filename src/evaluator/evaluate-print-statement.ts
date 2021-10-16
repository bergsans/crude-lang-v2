import { evaluate, Environment } from './evaluate';
import { NIL } from '../lexer/token-types';

export function evaluatePrintStatement(node, context: Environment) {
  evaluate(node.value, context);
  return NIL;
}
