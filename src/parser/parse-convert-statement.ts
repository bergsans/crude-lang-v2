import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { isSemicolonToken } from '../utils/predicates';
import { List } from '../utils/list';

export function parseConvertStatement(li: List<Token>) {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  if (isSemicolonToken(li)) {
    li.next();
  }
  return {
    type: 'Convert',
    value,
  };
}
