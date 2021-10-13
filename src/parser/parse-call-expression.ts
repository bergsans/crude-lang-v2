import { Token } from '../lexer/tokenize';
import { isRightParens, isCommaToken } from '../utils/predicates';
import { List } from '../utils/list';
import { parseExpressionStatement } from './parse-expression-statement';

export function parseCallExpression(li: List<Token>) {
  const name = li.next().literal;
  li.next();
  const args = [];
  while (!isRightParens(li)) {
    const expression = parseExpressionStatement(li);
    args.push(expression);
    if (isCommaToken(li)) {
      li.next();
    }
  }
  li.next();
  return {
    type: 'CallExpression',
    name,
    args,
  };
}
