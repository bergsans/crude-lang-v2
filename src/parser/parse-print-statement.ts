import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface PrintStatement extends Node {
  type: 'PrintStatement';
  value: Expression;
}

export function parsePrintStatement(li: List<Token>): PrintStatement {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  if (li.isHead('SEMICOLON')) {
    li.next();
  }
  return {
    type: 'PrintStatement',
    value,
  };
}
