import { Environment } from './evaluate';
import { NIL } from '../lexer/token-types';

export function evaluateClearStatement(node, context: Environment) {
  console.clear();
  return NIL;
}
