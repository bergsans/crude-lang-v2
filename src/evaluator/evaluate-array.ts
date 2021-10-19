import { Environment, evaluate } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateArray(node: AST.Array, context: Environment) {
  return node.elements.map((el: AST.ArrayElement) => evaluate(el, context));
}
