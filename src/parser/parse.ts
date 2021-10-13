import { Token, Metadata } from '../lexer/tokenize';
import { list } from '../utils/list';
import { Statement } from './parse-statement';
import { parseBlockStatement } from './parse-block-statement';

export type Value = Token;

export type Left = NodeTree;

export type Right = Left;

export interface NodeTree {
  left: Left;
  value: Value;
  right: Right;
}

export interface Node {
  type: string;
  meta: Metadata;
}

export interface Expression extends NodeTree {
  type: string;
  literal: string;
  expression: Expression;
  argument?: Expression;
}

export interface AST {
  type: 'Program';
  body: Statement[];
}

export function parse(tokens: Token[], stdLib?) {
  const li = list(tokens);
  const statements = parseBlockStatement(li);
  return {
    type: 'Program',
    body: stdLib ? [].concat(stdLib, statements) : statements,
  };
}
