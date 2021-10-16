import { NIL } from '../lexer/token-types';
import { evaluate, Environment } from './evaluate';

export function evaluateLetDeclaration(node, context: Environment) {
  const value = evaluate(node.statement, context);
  context.scope[node.id.name] = value;
  return NIL;
}
