import { NIL } from '../lexer/token-types';
import { fmtStr } from 'crude-dev-tools';
import RESERVED_KEYWORDS from '../lexer/reserved-keywords';
import { Expression, NodeTree } from '../parser/parse';
import { isOperatorType } from '../utils/predicates';
import { operations } from './operations';
import { Statement } from '../parser/parse-statement';
import { BlockStatement } from '../parser/parse-block-statement';

interface LexicalScope {
  [key: string]: any;
}

export interface Environment {
  scope: LexicalScope;
  parent: LexicalScope;
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
    throw new Error(
      fmtStr(`Unknown literal: ${node.collection.literal}`, 'red')
    );
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
    throw new Error(fmtStr('slice expected number for start.', 'red'));
  }
  if (start < 0) {
    throw new Error(fmtStr('start value cannot be negative.', 'red'));
  }
  const end = evaluate(node.end, context);
  if (typeof end !== 'number') {
    throw new Error(fmtStr('slice expected number for end.', 'red'));
  }
  if (end > value.length) {
    throw new Error(
      fmtStr(
        `End value cannot be greater than value length, ${value.length}.`,
        'red'
      )
    );
  }
  return value.slice(start, end);
}

export function evaluateBinaryExpression(node: NodeTree, context: Environment) {
  if (!node.left) {
    if (
      [
        'Concat',
        'Change',
        'Convert',
        'Length',
        'Slice',
        'CallExpression',
      ].includes(node.value.type)
    ) {
      return evaluate(node.value, context);
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
  return NIL;
}

export function environment(
  scope: LexicalScope,
  parent?: LexicalScope
): Environment {
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

function evaluateIfStatement(
  node: {
    type: string;
    condition: Expression;
    consequence: BlockStatement;
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

function evaluateConvertStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  return typeof value === 'string' ? parseInt(value, 10) : value.toString();
}

function evaluatePrintStatement(node, context: Environment) {
  const value = evaluate(node.value, context);
  console.log(value);
  return NIL;
}

function evaluateChangeStatement(node, context: Environment) {
  const array = evaluate(node.array, context);
  const index = evaluate(node.index, context);
  const value = evaluate(node.newValue, context);
  array[index] = value;
  return array;
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

function evaluateForStatement(node, context: Environment) {
  const id = node.id.literal;
  const start = evaluate(node.start, context);
  const end = evaluate(node.end, context);
  for (let i = start; i < end; i++) {
    context.scope[id] = i;
    evaluateBlockStatements(node.action.statements, context);
  }
  return NIL;
}

function evaluateCallExpression(node, context: Environment) {
  if (!context.get(node.name)) {
    throw new Error(fmtStr(`Unknown definition: ${node.name}`, 'red'));
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
  Convert: (node, context: Environment) =>
    evaluateConvertStatement(node, context),
  Print: (node, context: Environment) => evaluatePrintStatement(node, context),
  Change: (node, context: Environment) =>
    evaluateChangeStatement(node, context),
  Concat: (node, context: Environment) =>
    evaluateConcatStatement(node, context),
  Slice: (node, context: Environment) => evaluateSliceStatement(node, context),
  Length: (node, context: Environment) =>
    evaluateLengthStatement(node, context),
  For: (node, context: Environment) => evaluateForStatement(node, context),
  DefinitionStatement: (node, context: Environment) => {
    return evaluateDefinitionStatement(node, context);
  },
  CallExpression: (node, context: Environment) => {
    return evaluateCallExpression(node, context);
  },
  ARRAY: (node, context: Environment) => evaluateArray(node, context),
  ELEMENT: (node, context: Environment) => evaluateElement(node, context),
  BlockStatement: (node, context: Environment) =>
    evaluateBlockStatements(node, context),
  Program: (node, context: Environment) =>
    evaluateBlockStatements(node.body, context),
  STRING: (node, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  INTEGER: (node, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
  BOOLEAN: (node, context: Environment) =>
    evaluateLiteralExpression[node.value.type](node.value.literal, context),
};

export function evaluate(node, context = environment({})) {
  return node.type in evaluateTypes
    ? evaluateTypes[node.type](node, context)
    : NIL;
}
