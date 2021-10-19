import { NIL } from '../lexer/token-types';
import { evaluateTypes } from './evaluate-built-in-types';
import { environment } from './environment';
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
  | AST.DefinitionStatement;

export function evaluate(node: ASTNode, context = environment({})) {
  return node.type in evaluateTypes
    ? evaluateTypes[node.type](node, context)
    : NIL;
}
