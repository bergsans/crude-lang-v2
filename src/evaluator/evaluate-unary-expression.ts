import * as AST from '../parser/AST-types';
import { Environment, evaluate } from './evaluate';

export const evaluateUnaryExpression = {
  NOT: (node: AST.Expression, context: Environment) =>
    !evaluate(node.argument, context),
  MINUS: (node: AST.Expression, context: Environment) =>
    -evaluate(node.argument, context),
  PLUS: (node: AST.Expression, context: Environment) =>
    +evaluate(node.argument, context),
};
