import { Token } from '../lexer/tokenize';
import { IDENTIFIER } from '../lexer/token-types';
import {
  isCommaToken,
  isPeekToken,
  isLeftBrace,
  isRightParens,
} from '../utils/predicates';
import { List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';
import { parseBlockStatement } from './parse-block-statement';

export function parseDefinitionStatement(li: List<Token>) {
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
  const body = parseBlockStatement(li);
  return {
    type: 'DefinitionStatement',
    name: name.literal,
    params,
    body,
  };
}
