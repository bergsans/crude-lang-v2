import { Token } from '../lexer/tokenize';
import { isSemicolonToken } from '../utils/predicates';
import { List } from '../utils/list';
import { parseExpressionStatement } from './parse-expression-statement';

export function parseReturnStatement(li: List<Token>) {
  li.next();
  const value = parseExpressionStatement(li);
  if (li.get().length > 0 && isSemicolonToken(li)) {
    li.next();
  }
  return {
    type: 'ReturnStatement',
    value,
  };
}
