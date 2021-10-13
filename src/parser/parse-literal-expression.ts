import { Token } from '../lexer/tokenize';

export interface Identifier {
  type: string;
  name: string;
}

export function parseLiteralExpression(token: Token) {
  return {
    type: 'ExpressionStatement',
    expression: {
      ...token,
      type: token.type,
    },
  };
}
