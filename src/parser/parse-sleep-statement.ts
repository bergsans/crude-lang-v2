import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface SleepStatement extends Node {
  type: 'SleepStatement';
  value: Expression;
}

export function parseSleepStatement(li: List<Token>): SleepStatement {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'SleepStatement',
    value,
  };
}
