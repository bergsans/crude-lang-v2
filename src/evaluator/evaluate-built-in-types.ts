import { Environment } from './evaluate';
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

export const evaluateTypes = {
  LetDeclaration: (node, context: Environment) =>
    evaluateLetDeclaration(node, context),
  ClearStatement: (node, context: Environment) =>
    evaluateClearStatement(node, context),
  SleepStatement: (node, context: Environment) =>
    evaluateSleepStatement(node, context),
  SetStatement: (node, context: Environment) =>
    evaluateSetStatement(node, context),
  ReturnStatement: (node, context: Environment) =>
    evaluateReturnStatement(node, context),
  IfStatement: (node, context: Environment) =>
    evaluateIfStatement(node, context),
  UnaryExpression: (node, context: Environment) =>
    evaluateUnaryExpression[node.literal](node, context),
  BinaryExpression: (node, context: Environment) =>
    evaluateBinaryExpression(node, context),
  ExpressionStatement: (node, context: Environment) => {
    return evaluateLiteralExpression[node.expression.type](
      node.expression.literal,
      context
    );
  },
  ConvertStatement: (node, context: Environment) =>
    evaluateConvertStatement(node, context),
  PrintStatement: (node, context: Environment) =>
    evaluatePrintStatement(node, context),
  ChangeStatement: (node, context: Environment) =>
    evaluateChangeStatement(node, context),
  ConcatStatement: (node, context: Environment) =>
    evaluateConcatStatement(node, context),
  SliceStatement: (node, context: Environment) =>
    evaluateSliceStatement(node, context),
  LengthStatement: (node, context: Environment) =>
    evaluateLengthStatement(node, context),
  ForStatement: (node, context: Environment) =>
    evaluateForStatement(node, context),
  DefinitionStatement: (node, context: Environment) => {
    return evaluateDefinitionStatement(node, context);
  },
  CallExpression: (node, context: Environment) => {
    return evaluateCallExpression(node, context);
  },
  ARRAY: (node, context: Environment) => evaluateArray(node, context),
  ELEMENT: (node, context: Environment) => evaluateArrayElement(node, context),
  BlockStatement: (node, context: Environment) =>
    evaluateBlockStatements(node.statements, context),
  Program: (node, context: Environment) =>
    evaluateBlockStatements(node.body.statements, context),
  STRING: (node, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  INTEGER: (node, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  BOOLEAN: (node, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
};
