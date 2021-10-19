import { NIL } from '../lexer/token-types';
import { evaluate, Environment } from './evaluate';
import { LetDeclaration } from '../parser/parse-let-statement';

export function evaluateLetDeclaration(
  node: LetDeclaration,
  context: Environment
) {
  const value = evaluate(node.statement, context);
  context.scope[node.id.name] = value;
  return NIL;
}
