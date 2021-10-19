import { evaluate, Environment } from './evaluate';
import { NIL } from '../lexer/token-types';
import { SleepStatement } from '../parser/parse-sleep-statement';

function sleep(ms: number) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

export function evaluateSleepStatement(
  node: SleepStatement,
  context: Environment
) {
  const sleepMs = evaluate(node.value, context);
  sleep(sleepMs);
  return NIL;
}
