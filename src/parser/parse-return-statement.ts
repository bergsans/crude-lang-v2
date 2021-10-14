import { Token } from '../lexer/tokenize';
import { List } from '../utils/list';
import { parseExpressionStatement } from './parse-expression-statement';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface ReturnStatement extends Node {
  type: 'ReturnStatement';
  value: Expression;
}

export function parseReturnStatement(li: List<Token>): ReturnStatement {
  li.next();
  const value = parseExpressionStatement(li);
  if (li.get().length > 0 && li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'ReturnStatement',
    value,
  };
}
