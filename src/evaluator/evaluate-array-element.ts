import { fmtStr } from 'crude-dev-tools';
import { Environment, evaluate } from './evaluate';

export function evaluateArrayElement(node, context: Environment) {
  if (!context.get(node.collection.literal)) {
    throw new Error(
      fmtStr(`Unknown literal: ${node.collection.literal}`, 'red')
    );
  }
  const elements = context.get(node.collection.literal);
  const index = evaluate(node.index, context);
  return elements[index];
}
