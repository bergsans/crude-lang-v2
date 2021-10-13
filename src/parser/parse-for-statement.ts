import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { isLeftBrace } from '../utils/predicates';
import { List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';
import { parseBlockStatement } from './parse-block-statement';

export function parseForStatement(li: List<Token>) {
  li.next();
  const id = li.get()[1];
  const [, start, end] = parseGroupedExpression(3, li);
  if (!isLeftBrace(li)) {
    throw new Error(fmtStr('Expected block statement.', 'red'));
  }
  li.next();
  const c = { type: 'BlockStatement', statements: parseBlockStatement(li) };
  const action = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: 'For',
    id,
    start,
    end,
    action,
  };
}
