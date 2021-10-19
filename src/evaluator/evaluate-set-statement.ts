import { NIL } from '../lexer/token-types';
import { evaluate, Environment } from './evaluate';
import { SetStatement } from '../parser/parse-set-statement';

export function evaluateSetStatement(node: SetStatement, context: Environment) {
  const value = evaluate(node.statement, context);
  context.set(node.id.name, value);
  return NIL;
}
