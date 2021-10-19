import { Environment } from './environment';
import { evaluate } from './evaluate';
import * as AST from '../parser/AST-types';

export function evaluateConvertStatement(
  node: AST.ConvertStatement,
  context: Environment
) {
  const value = evaluate(node.value, context);
  return typeof value === 'string' ? parseInt(value, 10) : value.toString();
}
