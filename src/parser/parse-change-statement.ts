import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { isSemicolonToken } from '../utils/predicates';

export function parseChangeStatement(li: List<Token>) {
  li.next();
  const [array, index, newValue] = parseGroupedExpression(3, li);
  if (isSemicolonToken(li)) {
    li.next();
  }
  return {
    type: 'Change',
    array,
    index,
    newValue,
  };
}
