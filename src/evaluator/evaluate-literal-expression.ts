import RESERVED_KEYWORDS from '../lexer/reserved-keywords';
import { Environment } from './environment';

export const evaluateLiteralExpression = {
  Boolean: (literal: string, _context: Environment) =>
    literal === RESERVED_KEYWORDS.TRUE ? true : false,
  String: (literal: string, _context: Environment) => literal,
  Integer: (literal: string, _context: Environment) => parseInt(literal, 10),
  Identifier: (literal: string, context: Environment) => {
    return context.get(literal);
  },
};
