import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';

export function parseSliceStatement(li: List<Token>) {
  li.next();
  const [value, start, end] = parseGroupedExpression(3, li);
  return {
    type: 'Slice',
    value,
    start,
    end,
  };
}
