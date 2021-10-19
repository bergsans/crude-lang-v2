import { Environment } from './evaluate';
import { NIL } from '../lexer/token-types';
import * as AST from '../parser/AST-types';

export function evaluateClearStatement(
  _node: AST.ClearStatement,
  _context: Environment
) {
  console.clear();
  return NIL;
}
