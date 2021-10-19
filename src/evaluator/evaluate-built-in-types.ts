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
import { Program } from '../parser/parse';
import { NodeTree, BinaryExpression } from '../parser/parse-binary-expression';
import { BlockStatement } from '../parser/parse-block-statement';
import { LetDeclaration } from '../parser/parse-let-statement';
import { ClearStatement } from '../parser/parse-clear-statement';
import { SleepStatement } from '../parser/parse-sleep-statement';
import { SetStatement } from '../parser/parse-set-statement';
import { ReturnStatement } from '../parser/parse-return-statement';
import { IfStatement } from '../parser/parse-if-statement';
import { CallExpression } from '../parser/parse-call-expression';
import { Array, ArrayElement } from '../parser/parse-expression-statement';
import { ConvertStatement } from '../parser/parse-convert-statement';
import { PrintStatement } from '../parser/parse-print-statement';
import { ChangeStatement } from '../parser/parse-change-statement';
import { ConcatStatement } from '../parser/parse-concat-statement';
import { SliceStatement } from '../parser/parse-slice-statement';
import { LengthStatement } from '../parser/parse-length-statement';
import { ForStatement } from '../parser/parse-for-statement';
import { DefinitionStatement } from '../parser/parse-definition-statement';
import {
  Expression,
  UnaryExpression,
} from '../parser/parse-expression-statement';

export const evaluateTypes = {
  LetDeclaration: (node: LetDeclaration, context: Environment) =>
    evaluateLetDeclaration(node, context),
  ClearStatement: (node: ClearStatement, context: Environment) =>
    evaluateClearStatement(node, context),
  SleepStatement: (node: SleepStatement, context: Environment) =>
    evaluateSleepStatement(node, context),
  SetStatement: (node: SetStatement, context: Environment) =>
    evaluateSetStatement(node, context),
  ReturnStatement: (node: ReturnStatement, context: Environment) =>
    evaluateReturnStatement(node, context),
  IfStatement: (node: IfStatement, context: Environment) =>
    evaluateIfStatement(node, context),
  UnaryExpression: (node: UnaryExpression, context: Environment) =>
    evaluateUnaryExpression[node.literal](node, context),
  BinaryExpression: (node: BinaryExpression, context: Environment) =>
    evaluateBinaryExpression(node, context),
  ExpressionStatement: (node: Expression, context: Environment) => {
    return evaluateLiteralExpression[node.expression.type](
      node.expression.literal,
      context
    );
  },
  ConvertStatement: (node: ConvertStatement, context: Environment) =>
    evaluateConvertStatement(node, context),
  PrintStatement: (node: PrintStatement, context: Environment) =>
    evaluatePrintStatement(node, context),
  ChangeStatement: (node: ChangeStatement, context: Environment) =>
    evaluateChangeStatement(node, context),
  ConcatStatement: (node: ConcatStatement, context: Environment) =>
    evaluateConcatStatement(node, context),
  SliceStatement: (node: SliceStatement, context: Environment) =>
    evaluateSliceStatement(node, context),
  LengthStatement: (node: LengthStatement, context: Environment) =>
    evaluateLengthStatement(node, context),
  ForStatement: (node: ForStatement, context: Environment) =>
    evaluateForStatement(node, context),
  DefinitionStatement: (node: DefinitionStatement, context: Environment) => {
    return evaluateDefinitionStatement(node, context);
  },
  CallExpression: (node: CallExpression, context: Environment) => {
    return evaluateCallExpression(node, context);
  },
  Array: (node: Array, context: Environment) => evaluateArray(node, context),
  ArrayElement: (node: ArrayElement, context: Environment) =>
    evaluateArrayElement(node, context),
  BlockStatement: (node: BlockStatement, context: Environment) =>
    evaluateBlockStatements(node.statements, context),
  Program: (node: Program, context: Environment) =>
    evaluateBlockStatements(node.body.statements, context),
  String: (node: NodeTree, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  Integer: (node: NodeTree, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  Boolean: (node: NodeTree, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
};
