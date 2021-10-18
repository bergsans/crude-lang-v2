import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';

export interface ClearStatement extends Node {
  type: 'ClearStatement';
}

export function parseClearStatement(li: List<Token>): ClearStatement {
  li.next();
  parseGroupedExpression(1, li);
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'ClearStatement',
  };
}
