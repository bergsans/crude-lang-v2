import { Token } from '../lexer/tokenize';
import { isLeftBrace, isLeftParens } from '../utils/predicates';
import { List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';
import { parseExpressionStatement } from './parse-expression-statement';
import { parseBlockStatement } from './parse-block-statement';

export function parseIfStatement(li: List<Token>) {
  if (li.head().type === 'IF') {
    li.next();
  }
  if (!isLeftParens(li)) {
    throw new Error(fmtStr('Expected grouped expression.', 'red'));
  }
  li.next();
  const condition = parseExpressionStatement(li);
  li.next();
  if (!isLeftBrace(li)) {
    throw new Error(fmtStr('Expected block statement.', 'red'));
  }
  li.next();
  const c = { type: 'BlockStatement', statements: parseBlockStatement(li) };
  const consequence = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: 'IfStatement',
    condition,
    consequence,
  };
}
