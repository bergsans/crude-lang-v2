import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface ConvertStatement extends Node {
  type: 'ConvertStatement';
  value: Expression;
}

export function parseConvertStatement(li: List<Token>): ConvertStatement {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'ConvertStatement',
    value,
  };
}
