import { NIL } from '../lexer/token-types';
import { evaluate, Environment } from './evaluate';

export function evaluateSetStatement(node, context: Environment) {
  const value = evaluate(node.statement, context);
  context.set(node.id.name, value);
  return NIL;
}
