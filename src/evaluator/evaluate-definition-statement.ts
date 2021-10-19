import { NIL } from '../lexer/token-types';
import { environment, Environment } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateDefinitionStatement(
  node: AST.DefinitionStatement,
  context: Environment
) {
  context.scope[node.name] = {
    env: environment({}),
    params: node.params,
    body: node.body,
  };
  return NIL;
}
