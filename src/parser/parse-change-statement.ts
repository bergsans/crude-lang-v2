import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface ChangeStatement extends Node {
  type: 'ChangeStatement';
  array: Expression[];
  index: Expression;
  newValue: Expression;
}

export function parseChangeStatement(li: List<Token>): ChangeStatement {
  li.next();
  const [array, index, newValue] = parseGroupedExpression(3, li);
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'ChangeStatement',
    array,
    index,
    newValue,
  };
}
