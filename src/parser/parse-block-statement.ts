import { Token } from '../lexer/tokenize';
import { List } from '../utils/list';
import { parseStatement, Statement } from './parse-statement';
import { Node } from './parse';

export interface BlockStatement extends Node {
  type: 'BlockStatement';
  statements: Statement[];
}

export function parseBlockStatement(li: List<Token>): BlockStatement {
  const statements = [];
  while (li.get().length && !li.isHead('R_BRACE') && !li.isHead('EOF')) {
    const statement = parseStatement(li);
    statements.push(statement);
  }
  li.next();
  return {
    type: 'BlockStatement',
    statements,
  };
}
