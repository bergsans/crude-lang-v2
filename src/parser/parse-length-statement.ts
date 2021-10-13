import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';

export function parseLengthStatement(li: List<Token>) {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  return {
    type: 'Length',
    value,
  };
}
