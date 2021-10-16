import { Statement } from '../parser/parse-statement';
import { NIL } from '../lexer/token-types';
import { environment, Environment, evaluate } from './evaluate';

export function evaluateBlockStatements(
  statements: Statement[],
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
