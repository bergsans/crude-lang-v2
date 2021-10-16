import RESERVED_KEYWORDS from '../lexer/reserved-keywords';
import { Environment } from './evaluate';

export const evaluateLiteralExpression = {
  BOOLEAN: (literal: string, _context: Environment) =>
    literal === RESERVED_KEYWORDS.TRUE ? true : false,
  STRING: (literal: string, _context: Environment) => literal,
  INTEGER: (literal: string, _context: Environment) => parseInt(literal, 10),
  IDENTIFIER: (literal: string, context: Environment) => {
    return context.get(literal);
  },
};
