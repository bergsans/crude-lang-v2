import { NIL } from '../lexer/token-types';
import { evaluateTypes } from './evaluate-built-in-types';

import * as AST from '../parser/AST-types';

type ASTNode =
  | AST.Node
  | AST.Program
  | AST.BinaryExpression
  | AST.CallExpression
  | AST.Expression
  | AST.Statement
  | AST.BlockStatement
  | AST.LetDeclaration
  | AST.ChangeStatement
  | AST.ConcatStatement
  | AST.ClearStatement
  | AST.SleepStatement
  | AST.SliceStatement
  | AST.SetStatement
  | AST.ReturnStatement
  | AST.IfStatement
  | AST.Array
  | AST.ArrayElement
  | AST.ConvertStatement
  | AST.LengthStatement
  | AST.DefinitionStatement
  | AST.ForStatement;

interface LexicalScope {
  [key: string]: any;
}

export interface Environment {
  scope: LexicalScope;
  parent: LexicalScope | undefined;
  get(key: string): any;
  set(key: string, val: any): any;
}

export function environment(
  scope: LexicalScope,
  parent?: LexicalScope
): Environment {
  return {
    scope,
    parent,
    set(name: string, val: any) {
      if (name in scope) {
        scope[name] = val;
        return NIL;
      }
      if (parent !== undefined) {
        return parent.set(name, val);
      }
      throw new Error(`No settable identifier ${name} is declared.`);
    },
    get: (name: string) => {
      return name in scope
        ? scope[name]
        : parent !== undefined && parent.get(name);
    },
  };
}

export function evaluate(node: ASTNode, context = environment({})) {
  return node.type in evaluateTypes
    ? evaluateTypes[node.type](node, context)
    : NIL;
}
