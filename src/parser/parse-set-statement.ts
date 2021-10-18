import { Token } from '../lexer/tokenize';
import { characterNames, ASSIGN, NIL, IDENTIFIER } from '../lexer/token-types';
import { List } from '../utils/list';
import {
  Expression,
  parseExpressionStatement,
} from './parse-expression-statement';
import { Node } from './parse';
import { Identifier } from './parse-literal-expression';

export interface SetStatement extends Node {
  type: 'SetStatement';
  id: Identifier;
  statement: Expression;
}

export function parseSetStatement(li: List<Token>): SetStatement {
  li.next();
  const { id, statement } = parseAssignment(li);
  return { type: 'SetStatement', id, statement };
}

export function parseAssignment(li: List<Token>) {
  let currentToken = li.next();
  if (currentToken.type !== IDENTIFIER) {
    return NIL;
  }
  const id = {
    type: IDENTIFIER,
    name: currentToken.literal,
  };
  currentToken = li.next();
  if (currentToken.type !== characterNames[ASSIGN]) {
    return NIL;
  }
  const statement = parseExpressionStatement(li);
  return { id, statement };
}
