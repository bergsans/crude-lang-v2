import { NIL } from '../lexer/token-types';
import { environment, Environment } from './evaluate';

export function evaluateDefinitionStatement(node, context: Environment) {
  context.scope[node.name] = {
    env: environment({}),
    params: node.params,
    body: node.body,
  };
  return NIL;
}
