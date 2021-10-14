import { Token } from '../lexer/tokenize';
import { parseGroupedExpression } from './parse-helpers';
import { List } from '../utils/list';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';

export interface ConcatStatement extends Node {
  type: 'ConcatStatement';
  args: Expression[];
}

export function parseConcatStatement(li: List<Token>): ConcatStatement {
  li.next();
  const [firstValue, secondValue] = parseGroupedExpression(2, li);
  return {
    type: 'ConcatStatement',
    args: [firstValue, secondValue],
  };
}
