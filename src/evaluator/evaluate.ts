import { NIL } from '../lexer/token-types';
import RESERVED_KEYWORDS from '../lexer/reserved-keywords';
import { Statement, Expression, NodeTree } from '../parser/parse';
import {
  UnaryExpression,
  BinaryExpression,
  ExpressionStatement,
  BlockStatement,
  IfStatement,
  ReturnStatement,
  LITERAL_PRIMITIVES,
} from '../parser/parse-types';
import { isNodeType, isOperatorType } from '../utils/predicates';
import { operations } from './operations';

const evaluateUnaryExpression = {
  NOT: (node: Expression) => !evaluate(node.argument),
  MINUS: (node: Expression) => -evaluate(node.argument),
  PLUS: (node: Expression) => +evaluate(node.argument),
};

const evaluateLiteralExpression = {
  BOOLEAN: (literal: string) => {
    return literal === RESERVED_KEYWORDS.TRUE ? true : false;
  },
  INTEGER: (literal: string) => parseInt(literal, 10),
};

export function evaluateBinaryExpression(node: NodeTree) {
  if (!node.left) {
    return evaluateLiteralExpression[node.value.type](node.value.literal);
  }
  if (isOperatorType(node.value.type)) {
    return operations[node.value.type](
      evaluateBinaryExpression(node.left as NodeTree),
      evaluateBinaryExpression(node.right as NodeTree)
    );
  }
}

type BlockStatement = {
  type: string;
  statements: Statement[];
};
export function evaluateIfStatement(node: {
  type: string;
  condition: Expression;
  consequence: BlockStatement;
}) {
  const condition = evaluate(node.condition);
  if (condition) {
    return node.consequence.statements.length > 0
      ? evaluateBlockStatements(node.consequence.statements)
      : NIL;
  }
  return NIL;
}

function evaluateBlockStatements(statements: Statement[]) {
  for (const statement of statements) {
    const result = evaluate(statement);
    if (result !== NIL) {
      return result;
    }
  }
  return NIL;
}

function evaluateReturnStatement(node: any) {
  return evaluate(node.value);
}

export function evaluate(node: any) {
  if (node.body || isNodeType(node, BlockStatement)) {
    return evaluateBlockStatements(node.body);
  }
  if (isNodeType(node, ReturnStatement)) {
    return evaluateReturnStatement(node);
  }
  if (isNodeType(node, IfStatement)) {
    return evaluateIfStatement(node);
  }
  if (isNodeType(node, UnaryExpression)) {
    return evaluateUnaryExpression[node.literal](node);
  }
  if (isNodeType(node, BinaryExpression)) {
    return evaluateBinaryExpression(node);
  }
  if (isNodeType(node, ExpressionStatement)) {
    return evaluateLiteralExpression[node.expression.type](
      node.expression.literal
    );
  }
  if (LITERAL_PRIMITIVES.includes(node.value.type)) {
    return evaluateLiteralExpression[node.value.type](node.value.literal);
  }
  if (node.expression) return NIL;
}
