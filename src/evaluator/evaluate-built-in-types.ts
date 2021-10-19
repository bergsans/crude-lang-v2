import { Environment } from './environment';
import { evaluateArray } from './evaluate-array';
import { evaluateArrayElement } from './evaluate-array-element';
import { evaluateLiteralExpression } from './evaluate-literal-expression';
import { evaluateUnaryExpression } from './evaluate-unary-expression';
import { evaluateBlockStatements } from './evaluate-block-statements';
import { evaluateClearStatement } from './evaluate-clear-statement';
import { evaluateSleepStatement } from './evaluate-sleep-statement';
import { evaluateSetStatement } from './evaluate-set-statement';
import { evaluateLetDeclaration } from './evaluate-let-declaration';
import { evaluateReturnStatement } from './evaluate-return-statement';
import { evaluateIfStatement } from './evaluate-if-statement';
import { evaluateBinaryExpression } from './evaluate-binary-expression';
import { evaluatePrintStatement } from './evaluate-print-statement';
import { evaluateConvertStatement } from './evaluate-convert-statement';
import { evaluateChangeStatement } from './evaluate-change-statement';
import { evaluateDefinitionStatement } from './evaluate-definition-statement';
import { evaluateForStatement } from './evaluate-for-statement';
import { evaluateLengthStatement } from './evaluate-length-statement';
import { evaluateConcatStatement } from './evaluate-concat-statement';
import { evaluateSliceStatement } from './evaluate-slice-statement';
import { evaluateCallExpression } from './evaluate-call-expression';
import * as AST from '../parser/AST-types';

export const evaluateTypes = {
  LetDeclaration: (node: AST.LetDeclaration, context: Environment) =>
    evaluateLetDeclaration(node, context),
  ClearStatement: (node: AST.ClearStatement, context: Environment) =>
    evaluateClearStatement(node, context),
  SleepStatement: (node: AST.SleepStatement, context: Environment) =>
    evaluateSleepStatement(node, context),
  SetStatement: (node: AST.SetStatement, context: Environment) =>
    evaluateSetStatement(node, context),
  ReturnStatement: (node: AST.ReturnStatement, context: Environment) =>
    evaluateReturnStatement(node, context),
  IfStatement: (node: AST.IfStatement, context: Environment) =>
    evaluateIfStatement(node, context),
  UnaryExpression: (node: AST.UnaryExpression, context: Environment) =>
    evaluateUnaryExpression[node.literal](node, context),
  BinaryExpression: (node: AST.BinaryExpression, context: Environment) =>
    evaluateBinaryExpression(node, context),
  ExpressionStatement: (node: AST.Expression, context: Environment) => {
    return evaluateLiteralExpression[node.expression.type](
      node.expression.literal,
      context
    );
  },
  ConvertStatement: (node: AST.ConvertStatement, context: Environment) =>
    evaluateConvertStatement(node, context),
  PrintStatement: (node: AST.PrintStatement, context: Environment) =>
    evaluatePrintStatement(node, context),
  ChangeStatement: (node: AST.ChangeStatement, context: Environment) =>
    evaluateChangeStatement(node, context),
  ConcatStatement: (node: AST.ConcatStatement, context: Environment) =>
    evaluateConcatStatement(node, context),
  SliceStatement: (node: AST.SliceStatement, context: Environment) =>
    evaluateSliceStatement(node, context),
  LengthStatement: (node: AST.LengthStatement, context: Environment) =>
    evaluateLengthStatement(node, context),
  ForStatement: (node: AST.ForStatement, context: Environment) =>
    evaluateForStatement(node, context),
  DefinitionStatement: (
    node: AST.DefinitionStatement,
    context: Environment
  ) => {
    return evaluateDefinitionStatement(node, context);
  },
  CallExpression: (node: AST.CallExpression, context: Environment) => {
    return evaluateCallExpression(node, context);
  },
  Array: (node: AST.Array, context: Environment) =>
    evaluateArray(node, context),
  ArrayElement: (node: AST.ArrayElement, context: Environment) =>
    evaluateArrayElement(node, context),
  BlockStatement: (node: AST.BlockStatement, context: Environment) =>
    evaluateBlockStatements(node.statements, context),
  Program: (node: AST.Program, context: Environment) =>
    evaluateBlockStatements(node.body.statements, context),
  String: (node: AST.NodeTree, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  Integer: (node: AST.NodeTree, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  Boolean: (node: AST.NodeTree, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
};
