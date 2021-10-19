import { NIL } from '../lexer/token-types';
import * as AST from '../parser/AST-types';
import { environment, Environment } from './environment';
import { evaluate } from './evaluate';

export function evaluateBlockStatements(
  statements: AST.Statement[],
  context: Environment
) {
  const localEnvironment = environment({}, context);
  for (const statement of statements) {
    const result = evaluate(statement, localEnvironment);
    if (result !== NIL) {
      return result;
    }
  }
  return NIL;
}
