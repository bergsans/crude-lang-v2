import { fmtStr } from 'crude-dev-tools';
import { Environment, evaluate } from './evaluate';

export function evaluateSliceStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  const start = evaluate(node.start, context);
  if (typeof start !== 'number') {
    throw new Error(fmtStr('slice expected number for start.', 'red'));
  }
  if (start < 0) {
    throw new Error(fmtStr('start value cannot be negative.', 'red'));
  }
  const end = evaluate(node.end, context);
  if (typeof end !== 'number') {
    throw new Error(fmtStr('slice expected number for end.', 'red'));
  }
  if (end > value.length) {
    throw new Error(
      fmtStr(
        `End value cannot be greater than value length, ${value.length}.`,
        'red'
      )
    );
  }
  return value.slice(start, end);
}