import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface LengthStatement extends Node {
  type: 'LengthStatement';
  value: Expression;
}

export function parseLengthStatement(li: List<Token>) {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  return {
    type: 'LengthStatement',
    value,
  };
}
