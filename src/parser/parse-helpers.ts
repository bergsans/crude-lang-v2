import { Token } from '../lexer/tokenize';
import { fmtStr } from 'crude-dev-tools';
import { List } from '../utils/list';
import { parseStatement } from './parse-statement';
import { _parseBinaryExpression } from './parse-binary-expression';

export function parseGroupedExpression(expectedNVals: number, li: List<Token>) {
  if (!li.isHead('L_PAREN')) {
    throw new Error(fmtStr('Expected opening parenthesis.', 'red'));
  }
  li.next();
  const vals = [];
  for (let i = 0; i < expectedNVals; i++) {
    const value = parseStatement(li);
    vals.push(value);
    if (i < expectedNVals - 1 && li.isHead('COMMA')) {
      li.next();
    }
  }

  if (!li.isHead('R_PAREN')) {
    throw new Error(fmtStr('Expected closing parenthesis.', 'red'));
  }
  li.next();
  return vals;
}
