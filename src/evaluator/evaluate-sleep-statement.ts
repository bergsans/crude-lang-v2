import { evaluate, Environment } from './evaluate';
import { NIL } from '../lexer/token-types';

function sleep(ms: number) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

export function evaluateSleepStatement(node, context: Environment) {
  const sleepMs = evaluate(node.value, context);
  sleep(sleepMs);
  return NIL;
}
