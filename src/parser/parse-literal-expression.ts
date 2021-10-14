import { Token } from '../lexer/tokenize';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

// move
export interface Identifier {
  type: string;
  name: string;
}

export interface LiteralExpression extends Node {
  type: 'ExpressionStatement';
  expression: {
    type: string;
    literal: string;
  };
}

export function parseLiteralExpression(token: Token): LiteralExpression {
  return {
    type: 'ExpressionStatement',
    expression: {
      ...token,
      type: token.type,
    },
  };
}
