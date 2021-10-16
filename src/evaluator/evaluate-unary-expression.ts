import { Expression } from '../parser/parse-expression-statement';
import { Environment, evaluate } from './evaluate';

export const evaluateUnaryExpression = {
  NOT: (node: Expression, context: Environment) =>
    !evaluate(node.argument, context),
  MINUS: (node: Expression, context: Environment) =>
    -evaluate(node.argument, context),
  PLUS: (node: Expression, context: Environment) =>
    +evaluate(node.argument, context),
};
