import { fmtStr } from 'crude-dev-tools';
import { Environment, evaluate } from './evaluate';
import { ArrayElement } from '../parser/parse-expression-statement';

export function evaluateArrayElement(node: ArrayElement, context: Environment) {
  if (!context.get(node.collection.literal)) {
    throw new Error(
      fmtStr(`Unknown literal: ${node.collection.literal}`, 'red')
    );
  }
  const elements = context.get(node.collection.literal);
  const index = evaluate(node.index, context);
  return elements[index];
}
