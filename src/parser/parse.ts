import { Token, Metadata } from '../lexer/tokenize';
import { list } from '../utils/list';
import { BlockStatement, parseBlockStatement } from './parse-block-statement';

export interface Node {
  type: string;
  meta?: Metadata;
}

export interface Program extends Node {
  type: 'Program';
  body: BlockStatement;
}

export function parse(tokens: Token[], stdLib?): Program {
  const li = list(tokens);
  const body = parseBlockStatement(li);
  const statements = stdLib
    ? [].concat(stdLib.statements, body.statements)
    : body.statements;
  return {
    type: 'Program',
    body: {
      type: 'BlockStatement',
      statements,
    },
  };
}
