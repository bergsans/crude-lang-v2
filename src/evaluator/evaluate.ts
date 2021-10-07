import { NIL } from '../lexer/token-types';
import RESERVED_KEYWORDS from '../lexer/reserved-keywords';
import {
  BlockStatement as BlockStatementType,
  Statement,
  Expression,
  NodeTree,
} from '../parser/parse';
import {
  UnaryExpression,
  BinaryExpression,
  ExpressionStatement,
  BlockStatement,
  IfStatement,
  LetDeclaration,
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
  BOOLEAN: (literal: string, context) => {
    return literal === RESERVED_KEYWORDS.TRUE ? true : false;
  },
  INTEGER: (literal: string, context) => parseInt(literal, 10),
  IDENTIFIER: (literal: string, context) => {
    return context.get(literal);
  },
};

export function evaluateBinaryExpression(node: NodeTree, context: any) {
  if (!node.left) {
    return evaluateLiteralExpression[node.value.type](
      node.value.literal,
      context
    );
  }
  if (isOperatorType(node.value.type)) {
    return operations[node.value.type](
      evaluateBinaryExpression(node.left as NodeTree, context),
      evaluateBinaryExpression(node.right as NodeTree, context)
    );
  }
}

function environment(scope: any, parent?: any) {
  return {
    scope,
    parent,
    get: (name: string) => {
      return name in scope
        ? scope[name]
        : parent !== undefined && parent.get(name);
    },
  };
}

export function evaluateIfStatement(
  node: {
    type: string;
    condition: Expression;
    consequence: BlockStatementType;
  },
  context
) {
  const condition = evaluate(node.condition, context);
  if (condition) {
    return node.consequence.statements.length > 0
      ? evaluateBlockStatements(node.consequence.statements, context)
      : NIL;
  }
  return NIL;
}

function evaluateBlockStatements(statements: Statement[], context) {
  const localEnvironment = environment(context);
  for (const statement of statements) {
    const result = evaluate(statement, localEnvironment);
    if (result !== NIL) {
      return result;
    }
  }
  return NIL;
}

function evaluateReturnStatement(node, context) {
  return evaluate(node.value, context);
}

function evaluateLetDeclaration(node, context) {
  if (!context.get(node.id.name)) {
    context.scope[node.id.name] = evaluate(node.statement, context);
  }
  return NIL;
}

const evaluateTypes = {
  [ReturnStatement]: (node, context) => evaluateReturnStatement(node, context),
  [IfStatement]: (node, context) => evaluateIfStatement(node, context),
  [UnaryExpression]: (node, context) =>
    evaluateUnaryExpression[node.literal](node, context),
  [BinaryExpression]: (node, context) =>
    evaluateBinaryExpression(node, context),
  [ExpressionStatement]: (node, context) => {
    return evaluateLiteralExpression[node.expression.type](
      node.expression.literal,
      context
    );
  },
};

export function evaluate(node, context = environment({})) {
  if (node.body || isNodeType(node, BlockStatement)) {
    return evaluateBlockStatements(node.body, context);
  }
  if (node.type === LetDeclaration) {
    return evaluateLetDeclaration(node, context);
  }
  if (node.type in evaluateTypes) {
    return evaluateTypes[node.type](node, context);
  }
  if (LITERAL_PRIMITIVES.includes(node.value.type)) {
    return evaluateLiteralExpression[node.value.type](
      node.value.literal,
      context
    );
  }
  if (node.expression) return NIL;
}
