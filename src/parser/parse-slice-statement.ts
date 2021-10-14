import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface SliceStatement extends Node {
  type: 'SliceStatement';
  value: Expression;
  start: Expression;
  end: Expression;
}

export function parseSliceStatement(li: List<Token>): SliceStatement {
  li.next();
  const [value, start, end] = parseGroupedExpression(3, li);
  return {
    type: 'SliceStatement',
    value,
    start,
    end,
  };
}
