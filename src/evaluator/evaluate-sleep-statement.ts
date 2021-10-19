import { Environment } from './environment';
import { evaluate } from './evaluate';
import { NIL } from '../lexer/token-types';
import * as AST from '../parser/AST-types';

function sleep(ms: number) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

export function evaluateSleepStatement(
  node: AST.SleepStatement,
  context: Environment
) {
  const sleepMs = evaluate(node.value, context);
  sleep(sleepMs);
  return NIL;
}
