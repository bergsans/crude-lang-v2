import { Token } from '../lexer/tokenize';
import { isRightParens, isCommaToken } from '../utils/predicates';
import { List } from '../utils/list';
import {
  Expression,
  parseExpressionStatement,
} from './parse-expression-statement';
import { Node } from './parse';

interface CallExpression extends Node {
  type: 'CallExpression';
  name: string;
  args: Expression[];
}

export function parseCallExpression(li: List<Token>): CallExpression {
  const name = li.next().literal;
  li.next();
  const args = [];
  while (!isRightParens(li)) {
    const expression = parseExpressionStatement(li);
    args.push(expression);
    if (isCommaToken(li)) {
      li.next();
    }
  }
  li.next();
  return {
    type: 'CallExpression',
    name, // callee
    args,
  };
}
