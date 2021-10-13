import { Token } from '../lexer/tokenize';
import { isCommaToken, isLeftParens, isRightParens } from '../utils/predicates';
import { fmtStr } from 'crude-dev-tools';
import { List } from '../utils/list';
import { parseStatement } from './parse-statement';
import { _parseBinaryExpression } from './parse-binary-expression';

export function parseGroupedExpression(expectedNVals: number, li: List<Token>) {
  if (!isLeftParens(li)) {
    throw new Error(fmtStr('Expected opening parenthesis.', 'red'));
  }
  li.next();
  const vals = [];
  for (let i = 0; i < expectedNVals; i++) {
    const value = parseStatement(li);
    vals.push(value);
    if (i < expectedNVals - 1 && isCommaToken(li)) {
      li.next();
    }
  }

  if (!isRightParens(li)) {
    throw new Error(fmtStr('Expected closing parenthesis.', 'red'));
  }
  li.next();
  return vals;
}
