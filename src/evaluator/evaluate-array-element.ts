import { fmtStr } from 'crude-dev-tools';
import { evaluate } from './evaluate';
import { Environment } from './environment';
import * as AST from '../parser/AST-types';
export function evaluateArrayElement(
  node: AST.ArrayElement,
  context: Environment
) {
  if (!context.get(node.collection.literal)) {
    throw new Error(
      fmtStr(`Unknown literal: ${node.collection.literal}`, 'red')
    );
  }
  const elements = context.get(node.collection.literal);
  const index = evaluate(node.index, context);
  return elements[index];
}
