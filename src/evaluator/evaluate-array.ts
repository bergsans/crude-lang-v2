import { evaluate } from './evaluate';
import { Environment } from './environment';
import * as AST from '../parser/AST-types';

export function evaluateArray(node: AST.Array, context: Environment) {
  return node.elements.map((el: AST.ArrayElement) => evaluate(el, context));
}
