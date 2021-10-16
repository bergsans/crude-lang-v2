import { Environment, evaluate } from './evaluate';

export function evaluateArray(node, context: Environment) {
  return node.elements.map((el) => evaluate(el, context));
}
