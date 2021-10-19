import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';
import { parseBlockStatement, BlockStatement } from './parse-block-statement';
import { Node } from './parse';
import { Identifier } from './parse-literal-expression';
import { Expression } from './parse-expression-statement';

export interface ForStatement extends Node {
  type: 'ForStatement';
  id: Identifier;
  start: Expression;
  end: Expression;
  action: BlockStatement;
}

export function parseForStatement(li: List<Token>): ForStatement {
  li.next();
  const id = {
    type: 'Identifier',
    name: li.get()[1].literal,
  };
  const [, start, end] = parseGroupedExpression(3, li);
  if (!li.isHead('L_BRACE')) {
    throw new Error(fmtStr('Expected block statement.', 'red'));
  }
  li.next();
  const c: BlockStatement = parseBlockStatement(li);
  const action = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: 'ForStatement',
    id,
    start,
    end,
    action,
  };
}
