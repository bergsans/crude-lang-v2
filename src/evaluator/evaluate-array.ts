import { Environment, evaluate } from './evaluate';
import { Array, ArrayElement } from '../parser/parse-expression-statement';

export function evaluateArray(node: Array, context: Environment) {
  return node.elements.map((el: ArrayElement) => evaluate(el, context));
}
