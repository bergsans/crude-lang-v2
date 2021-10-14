import { Token } from '../lexer/tokenize';
import { List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';
import { parseExpressionStatement } from './parse-expression-statement';
import { BlockStatement, parseBlockStatement } from './parse-block-statement';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface IfStatement extends Node {
  type: 'IfStatement';
  condition: Expression;
  consequence: BlockStatement;
}

export function parseIfStatement(li: List<Token>): IfStatement {
  if (li.isHead('IF')) {
    li.next();
  }
  if (!li.isHead('L_PAREN')) {
    throw new Error(fmtStr('Expected grouped expression.', 'red'));
  }
  li.next();
  const condition = parseExpressionStatement(li);
  li.next();
  if (!li.isHead('L_BRACE')) {
    throw new Error(fmtStr('Expected block statement.', 'red'));
  }
  li.next();
  const c: BlockStatement = parseBlockStatement(li);
  const consequence = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: 'IfStatement',
    condition,
    consequence,
  };
}
