import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';

export function parseConcatStatement(li: List<Token>) {
  li.next();
  const [firstValue, secondValue] = parseGroupedExpression(2, li);
  return {
    type: 'Concat',
    args: [firstValue, secondValue],
  };
}
