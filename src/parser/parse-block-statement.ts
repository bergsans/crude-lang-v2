import { Token } from '../lexer/tokenize';
import { isRightBrace, isEOF } from '../utils/predicates';
import { List } from '../utils/list';
import { parseStatement, Statement } from './parse-statement';
import { Node } from './parse';

export interface BlockStatement extends Node {
  type: 'BlockStatement';
  statements: Statement[];
}

export function parseBlockStatement(li: List<Token>) {
  const statements = [];
  while (li.get().length && !isRightBrace(li) && !isEOF(li)) {
    const statement = parseStatement(li);
    statements.push(statement);
  }
  li.next();
  return statements;
}
