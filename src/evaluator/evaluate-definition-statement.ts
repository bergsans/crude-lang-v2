import { NIL } from '../lexer/token-types';
import { environment, Environment } from './evaluate';
import { DefinitionStatement } from '../parser/parse-definition-statement';

export function evaluateDefinitionStatement(
  node: DefinitionStatement,
  context: Environment
) {
  context.scope[node.name] = {
    env: environment({}),
    params: node.params,
    body: node.body,
  };
  return NIL;
}
