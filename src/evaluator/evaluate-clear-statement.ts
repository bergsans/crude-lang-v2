import { Environment } from './evaluate';
import { NIL } from '../lexer/token-types';
import { ClearStatement } from '../parser/parse-clear-statement';

export function evaluateClearStatement(
  _node: ClearStatement,
  _context: Environment
) {
  console.clear();
  return NIL;
}
