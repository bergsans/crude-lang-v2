import { NIL } from '../lexer/token-types';
import RESERVED_KEYWORDS from '../lexer/reserved-keywords';
import {
  BlockStatement as BlockStatementType,
  Statement,
  Expression,
  NodeTree,
} from '../parser/parse';
import {
  BlockStatement,
  CallExpression,
  LITERAL_PRIMITIVES,
} from '../parser/parse-types';
import { isNodeType, isOperatorType } from '../utils/predicates';
import { operations } from './operations';

interface LexicalScope {
  [key: string]: any;
}

export interface Environment {
  scope: LexicalScope;
  parent: LexicalScope;
  set(key: string, value: any): any;
  get(key: string): any;
}

const evaluateUnaryExpression = {
  NOT: (node: Expression, context: Environment) =>
    !evaluate(node.argument, context),
  MINUS: (node: Expression, context: Environment) =>
    -evaluate(node.argument, context),
  PLUS: (node: Expression, context: Environment) =>
    +evaluate(node.argument, context),
};

const evaluateLiteralExpression = {
  BOOLEAN: (literal: string, _context: Environment) =>
    literal === RESERVED_KEYWORDS.TRUE ? true : false,
  STRING: (literal: string, _context: Environment) => literal,
  INTEGER: (literal: string, _context: Environment) => parseInt(literal, 10),
  IDENTIFIER: (literal: string, context: Environment) => {
    return context.get(literal);
  },
};

function evaluateArray(node, context: Environment) {
  return node.elements.map((el) => evaluate(el, context));
}

function evaluateElement(node, context: Environment) {
  if (!context.get(node.collection.literal)) {
    throw new Error(`Unknown literal: ${node.collection.literal}`);
  }
  const elements = context.get(node.collection.literal);
  const index = evaluate(node.index, context);
  return elements[index];
}

function evaluateConcatStatement(node, context: Environment) {
  const [firstValue, secondValue] = node.args;
  const a = evaluate(firstValue, context);
  const b = evaluate(secondValue, context);
  return [].concat(a, b);
}

function evaluateLengthStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  return value.length;
}

function evaluateSliceStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  const start = evaluate(node.start, context);
  if (typeof start !== 'number') {
    throw new Error('slice expected number for start.');
  }
  if (start < 0) {
    throw new Error('start value cannot be negative.');
  }
  const end = evaluate(node.end, context);
  if (typeof end !== 'number') {
    throw new Error('slice expected number for end.');
  }
  if (end > value.length) {
    throw new Error(
      `End value cannot be greater than value length, ${value.length}.`
    );
  }
  return value.slice(start, end);
}

export function evaluateBinaryExpression(node: NodeTree, context: Environment) {
  if (!node.left) {
    if (node.value.type === 'Concat') {
      return evaluateConcatStatement(node.value, context);
    }
    if (node.value.type === 'Length') {
      return evaluateLengthStatement(node.value, context);
    }
    if (node.value.type === 'Slice') {
      return evaluateSliceStatement(node.value, context);
    }
    if (node.value.type === CallExpression) {
      return evaluateCallExpression(node.value, context);
    }
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

export function environment(
  scope: LexicalScope,
  parent?: LexicalScope
): Environment {
  return {
    scope,
    parent,
    set: (name: string, value) => {
      if (name in scope) {
        scope = value;
      }
      if (parent !== undefined) {
        return parent.set(name, value);
      }
    },
    get: (name: string) => {
      return name in scope
        ? scope[name]
        : parent !== undefined && parent.get(name);
    },
  };
}

function evaluateIfStatement(
  node: {
    type: string;
    condition: Expression;
    consequence: BlockStatementType;
  },
  context: Environment
) {
  const condition = evaluate(node.condition, context);
  if (condition) {
    return node.consequence.statements.length > 0
      ? evaluateBlockStatements(node.consequence.statements, context)
      : NIL;
  }
  return NIL;
}

function evaluateBlockStatements(
  statements: Statement[],
  context: Environment
) {
  const localEnvironment = environment({}, context);
  for (const statement of statements) {
    const result = evaluate(statement, localEnvironment);
    if (result !== NIL) {
      return result;
    }
  }
  return NIL;
}

function evaluateReturnStatement(node, context: Environment) {
  return evaluate(node.value, context);
}

function evaluatePrintStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  console.log(value);
  return;
}

function evaluateLetDeclaration(node, context: Environment) {
  const value = evaluate(node.statement, context);
  context.scope[node.id.name] = value;
  return NIL;
}

function evaluateDefinitionStatement(node, context: Environment) {
  context.scope[node.name] = {
    env: environment({}),
    params: node.params,
    body: node.body,
  };
  return NIL;
}

function evaluateCallExpression(node, context: Environment) {
  if (!context.get(node.name)) {
    throw new Error(`Unknown definition: ${node.name}`);
  }
  const { env, params, body } = context.get(node.name);
  const updateEnv = params.reduce(
    (acc, v, i) => ({
      ...acc,
      [v.literal]: evaluate(node.args[i], context),
    }),
    env
  );
  const functionEnvironment = environment(updateEnv, context);
  return evaluateBlockStatements(body, functionEnvironment);
}

const evaluateTypes = {
  LetDeclaration: (node, context: Environment) =>
    evaluateLetDeclaration(node, context),
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
  Print: (node, context: Environment) => evaluatePrintStatement(node, context),
  Concat: (node, context: Environment) =>
    evaluateConcatStatement(node, context),
  Slice: (node, context: Environment) => evaluateSliceStatement(node, context),
  Length: (node, context: Environment) =>
    evaluateLengthStatement(node, context),
  DefinitionStatement: (node, context: Environment) => {
    return evaluateDefinitionStatement(node, context);
  },
  CallExpression: (node, context: Environment) => {
    return evaluateCallExpression(node, context);
  },
};

export function evaluate(node, context = environment({})) {
  if (node.type in evaluateTypes) {
    return evaluateTypes[node.type](node, context);
  }
  if (node.body || isNodeType(node, BlockStatement)) {
    return evaluateBlockStatements(node.body, context);
  }
  if (node.type === 'ARRAY') {
    return evaluateArray(node, context);
  }
  if (node.type === 'ELEMENT') {
    return evaluateElement(node, context);
  }
  if (LITERAL_PRIMITIVES.includes(node.value.type)) {
    return evaluateLiteralExpression[node.value.type](
      node.value.literal,
      context
    );
  }
  if (node.expression) return NIL;
}
