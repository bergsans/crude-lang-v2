import { Literal, Token } from '../lexer/tokenize';
import { IDENTIFIER } from '../lexer/token-types';
import {
  isCommaToken,
  isPeekToken,
  isLeftBrace,
  isRightParens,
} from '../utils/predicates';
import { List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';
import { parseBlockStatement, BlockStatement } from './parse-block-statement';
import { Node } from './parse';
import { Expression } from './parse-expression-statement';
import { LiteralExpression } from './parse-literal-expression';

export interface DefinitionStatement extends Node {
  type: 'DefinitionStatement';
  name: string;
  params: LiteralExpression[];
  body: BlockStatement;
}

export function parseDefinitionStatement(li: List<Token>): DefinitionStatement {
  li.next();
  const name = li.next();
  if (name.type !== IDENTIFIER) {
    throw new Error(fmtStr('Expected definition name.', 'red'));
  }
  if (!isPeekToken(li.head(), 'L_PAREN')) {
    throw new Error(fmtStr('Expected opening parenthesis.', 'red'));
  }
  li.next();
  const params = [];
  while (!isRightParens(li)) {
    if (!isPeekToken(li.head(), IDENTIFIER)) {
      throw new Error(fmtStr('Expected definition parameter.', 'red'));
    }
    const currentToken = li.next();
    params.push(currentToken);
    if (isCommaToken(li)) {
      li.next();
    }
  }
  li.next();
  if (!isLeftBrace(li)) {
    throw new Error(fmtStr('Expected definition body.', 'red'));
  }
  li.next();
  const body: BlockStatement = parseBlockStatement(li);
  return {
    type: 'DefinitionStatement',
    name: name.literal,
    params,
    body,
  };
}
