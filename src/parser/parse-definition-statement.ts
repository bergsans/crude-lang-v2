import { Token } from '../lexer/tokenize';
import { IDENTIFIER } from '../lexer/token-types';
import { isPeekToken } from '../utils/predicates';
import { List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';
import { parseBlockStatement, BlockStatement } from './parse-block-statement';
import { Node } from './parse';
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
  while (!li.isHead('R_PAREN')) {
    if (!isPeekToken(li.head(), IDENTIFIER)) {
      throw new Error(fmtStr('Expected definition parameter.', 'red'));
    }
    const currentToken = li.next();
    params.push(currentToken);
    if (li.isHead('COMMA')) {
      li.next();
    }
  }
  li.next();
  if (!li.isHead('L_BRACE')) {
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
