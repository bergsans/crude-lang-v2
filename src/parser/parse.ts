import { Tokens, Token } from '../lexer/tokenize';
import {
  characterNames,
  LET,
  ASSIGN,
  SLICE,
  CONCAT,
  LENGTH,
  DEFINE,
  RETURN_STATEMENT,
  PRINT,
  IF,
  NIL,
  IDENTIFIER,
} from '../lexer/token-types';
import {
  BinaryExpression,
  LetDeclaration,
  ExpressionStatement,
  DefinitionStatement,
  BlockStatement,
  IfStatement,
  ReturnStatement,
  Program,
  precedence,
  END_OF_STATEMENT,
} from './parse-types';
import {
  produceSliceStatement,
  produceConcatStatement,
  produceLengthStatement,
  produceArray,
  produceArrayIndex,
  produceCallExpression,
  producePrimitive,
  produceInfixNotAndBoolean,
  producePrimitiveAndEndOfStatement,
  produceIdentifierAndEndOfStatement,
  produceInfixNotAndGroupedExpression,
  produceArithmeticOperatorAndGroupedExpression,
} from './parse-helpers';
import {
  isPeekToken,
  isArithmeticOperatorAndGroupedExpression,
  isPrimitiveAndEndOfStatement,
  isPartOfBinaryExpression,
  isIdentifierAndEndOfStatement,
  isGroupedExpression,
  isSliceStatement,
  isArray,
  isArrayIndex,
  isConcatStatement,
  isLengthStatement,
  isArithmeticInfix,
  isCallExpression,
  isPrimitive,
  isInfixNotAndBoolean,
  isInfixNotAndGroupedExpression,
} from '../utils/predicates';
import { list, List } from '../utils/list';
import importStdLib from '../utils/import-std-lib';

type Value = Token;

type Left = NodeTree;

type Right = Left;

export interface NodeTree {
  left: Left;
  value: Value;
  right: Right;
}

export interface Expression extends NodeTree {
  type: string;
  literal: string;
  expression: Expression;
  argument?: Expression;
}

export type BlockStatement = {
  type: string;
  statements: Statement[];
};

interface Identifier {
  type: string;
  name: string;
}

export interface Statement {
  type:
    | typeof LetDeclaration
    | typeof ExpressionStatement
    | typeof BinaryExpression;
  statement: Statement;
  id?: Identifier;
  expression?: Expression;
}

export interface AST {
  type: 'Program';
  body: Statement[];
}

type TokenList = List<Token>;

type ParseExpressionPredicate = (li: List<Token>) => boolean;

type ParseExpressionProducer = any; // Fix node types

type ParseExpressionHandler = [
  ParseExpressionPredicate,
  ParseExpressionProducer
];

const parseExpressionHandlers: ParseExpressionHandler[] = [
  [isSliceStatement, produceSliceStatement],
  [isConcatStatement, produceConcatStatement],
  [isLengthStatement, produceLengthStatement],
  [isArrayIndex, produceArrayIndex],
  [isArray, produceArray],
  [isCallExpression, produceCallExpression],
  [isPrimitiveAndEndOfStatement, producePrimitiveAndEndOfStatement],
  [isInfixNotAndBoolean, produceInfixNotAndBoolean],
  [isInfixNotAndGroupedExpression, produceInfixNotAndGroupedExpression],
  [
    isArithmeticOperatorAndGroupedExpression,
    produceArithmeticOperatorAndGroupedExpression,
  ],
  [isPartOfBinaryExpression, _parseBinaryExpression],
  [isPrimitive, producePrimitive],
  [isIdentifierAndEndOfStatement, produceIdentifierAndEndOfStatement],
];

function tree(left: any, node: any, right: any) {
  return {
    left,
    value: node,
    right,
  };
}

function nud(li: TokenList) {
  const head = li.head();
  if (isGroupedExpression(head)) {
    li.next();
    const expression = parseBinaryExpression(li, 0);
    li.next();
    return expression;
  }
  if (isArithmeticInfix(head)) {
    const sign = li.next().literal;
    const node = li.next();
    node.literal = sign + node.literal;
    return tree(null, node, null);
  }
  if (isSliceStatement(li)) {
    const expression = parseSliceStatement(li);
    return tree(null, expression, null);
  }
  if (isConcatStatement(li)) {
    const expression = parseConcatStatement(li);
    return tree(null, expression, null);
  }
  if (isLengthStatement(li)) {
    const expression = parseLengthStatement(li);
    return tree(null, expression, null);
  }
  if (isCallExpression(li)) {
    const callExpression = parseCallExpression(li);
    return tree(null, callExpression, null);
  }
  return tree(null, li.next(), null);
}

function led(li: TokenList, left: Left, operator: Token) {
  return tree(
    left,
    operator,
    parseBinaryExpression(li, precedence[operator.type])
  );
}

function parseBinaryExpression(li: TokenList, currentPrecedence = 0) {
  let left = nud(li);
  if (li.head().type === END_OF_STATEMENT) {
    return left;
  }
  while (precedence[li.head().type] > currentPrecedence) {
    left = led(li, left, li.next());
  }
  return left;
}

function removeDeadNodes(node: NodeTree) {
  if (node.left) {
    node.left = removeDeadNodes(node.left);
  }
  if (node.right) {
    node.right = removeDeadNodes(node.right);
  }
  if (!node.left && !node.right) {
    delete node.left;
    delete node.right;
  }
  return node;
}

export function parse(tokens: Tokens, stdLib?) {
  const li = list(tokens);
  const statements = parseBlockStatement(li);
  return {
    type: Program,
    body: stdLib ? [].concat(stdLib, statements) : statements,
  };
}

export function _parseBinaryExpression(li: List<Token>) {
  const result = parseBinaryExpression(li);
  if (li.head().type === END_OF_STATEMENT) {
    li.next();
  }
  const purifiedNode = removeDeadNodes(result);
  return {
    type: BinaryExpression,
    ...purifiedNode,
  };
}

export function parseLiteralExpression(token: Token) {
  return {
    type: ExpressionStatement,
    expression: {
      ...token,
      type: token.type,
    },
  };
}

export function parseCallExpression(li: List<Token>) {
  const name = li.next().literal;
  li.next();
  const args = [];
  while (li.head().type !== 'R_PAREN') {
    const expression = parseExpressionStatement(li);
    args.push(expression);
    if (li.head().type === 'COMMA') {
      li.next();
    }
  }
  li.next();
  return {
    type: 'CallExpression',
    name,
    args,
  };
}

export function parseExpressionStatement(li: List<Token>) {
  for (const [predicate, producer] of parseExpressionHandlers) {
    if (predicate(li)) {
      return producer(li);
    }
  }
  return NIL;
}

export function parseLetStatement(li: List<Token>) {
  li.next();
  const { id, statement } = parseAssignment(li);
  return { type: LetDeclaration, id, statement };
}

export function parseAssignment(li: List<Token>) {
  let currentToken = li.next();
  if (currentToken.type !== IDENTIFIER) {
    return NIL;
  }
  const id = {
    type: IDENTIFIER,
    name: currentToken.literal,
  };
  currentToken = li.next();
  if (currentToken.type !== characterNames[ASSIGN]) {
    return NIL;
  }
  const statement = parseExpressionStatement(li);
  return { id, statement };
}

export function parseBlockStatement(li: List<Token>) {
  const statements = [];
  while (
    li.get().length &&
    li.head().type !== 'R_BRACE' &&
    li.head().type !== 'EOF'
  ) {
    const statement = parseStatement(li);
    statements.push(statement);
  }
  li.next();
  return statements;
}

export function parseIfStatement(li: List<Token>) {
  if (li.head().type === 'IF') {
    li.next();
  }
  if (li.head().type !== 'L_PAREN') {
    throw new Error('Expected grouped expression.');
  }
  li.next();
  const condition = parseExpressionStatement(li);
  li.next();
  if (li.head().type !== 'L_BRACE') {
    throw new Error('Expected block statement.');
  }
  li.next();
  const c = { type: BlockStatement, statements: parseBlockStatement(li) };
  const consequence = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: IfStatement,
    condition,
    consequence,
  };
}

export function parseReturnStatement(li: List<Token>) {
  li.next();
  const value = parseExpressionStatement(li);
  if (li.get().length > 0 && li.head().type === END_OF_STATEMENT) {
    li.next();
  }
  return {
    type: ReturnStatement,
    value,
  };
}

export function parseSliceStatement(li: List<Token>) {
  li.next();
  if (!isPeekToken(li.head(), 'L_PAREN')) {
    throw new Error('Expected opening parenthesis.');
  }
  li.next();
  const value = parseExpressionStatement(li);
  if (!isPeekToken(li.head(), 'COMMA')) {
    throw new Error('Expected start value.');
  }
  li.next();
  const start = parseExpressionStatement(li);
  if (!isPeekToken(li.head(), 'COMMA')) {
    throw new Error('Expected end value.');
  }
  li.next();
  const end = parseExpressionStatement(li);
  if (!isPeekToken(li.head(), 'R_PAREN')) {
    throw new Error('Expected closing parenthesis.');
  }
  li.next();
  return {
    type: 'Slice',
    value,
    start,
    end,
  };
}

export function parsePrintStatement(li: List<Token>) {
  li.next();
  if (!isPeekToken(li.head(), 'L_PAREN')) {
    throw new Error('Expected opening parenthesis.');
  }
  li.next();
  const value = parseExpressionStatement(li);
  if (!isPeekToken(li.head(), 'R_PAREN')) {
    throw new Error('Expected closing parenthesis.');
  }
  li.next();
  li.next();
  return {
    type: 'Print',
    value,
  };
}

export function parseConcatStatement(li: List<Token>) {
  li.next();
  if (!isPeekToken(li.head(), 'L_PAREN')) {
    throw new Error('Expected opening parenthesis.');
  }
  li.next();
  const firstValue = parseExpressionStatement(li);
  if (!isPeekToken(li.head(), 'COMMA')) {
    throw new Error('Expected another argument.');
  }
  li.next();
  const secondValue = parseExpressionStatement(li);
  if (!isPeekToken(li.head(), 'R_PAREN')) {
    throw new Error('Expected closing parenthesis.');
  }
  li.next();
  return {
    type: 'Concat',
    args: [firstValue, secondValue],
  };
}

export function parseLengthStatement(li: List<Token>) {
  li.next();
  if (!isPeekToken(li.head(), 'L_PAREN')) {
    throw new Error('Expected opening parenthesis.');
  }
  li.next();
  const value = parseExpressionStatement(li);
  if (!isPeekToken(li.head(), 'R_PAREN')) {
    throw new Error('Expected opening parenthesis.');
  }
  li.next();
  return {
    type: 'Length',
    value,
  };
}

export function parseDefinitionStatement(li: List<Token>) {
  li.next();
  const name = li.next();
  if (name.type !== IDENTIFIER) {
    throw new Error('Expected definition name.');
  }
  if (!isPeekToken(li.head(), 'L_PAREN')) {
    throw new Error('Expected opening parenthesis.');
  }
  li.next();
  const params = [];
  while (!isPeekToken(li.head(), 'R_PAREN')) {
    if (!isPeekToken(li.head(), IDENTIFIER)) {
      throw new Error('Expected definition parameter.');
    }
    const currentToken = li.next();
    params.push(currentToken);
    if (isPeekToken(li.head(), 'COMMA')) {
      li.next();
    }
  }
  li.next();
  if (!isPeekToken(li.head(), 'L_BRACE')) {
    throw new Error('Expected definition body.');
  }
  li.next();
  const body = parseBlockStatement(li);
  return {
    type: DefinitionStatement,
    name: name.literal,
    params,
    body,
  };
}

const statementTypes = {
  [RETURN_STATEMENT]: (li: List<Token>) => parseReturnStatement(li),
  [DEFINE]: (li: List<Token>) => parseDefinitionStatement(li),
  [SLICE]: (li: List<Token>) => parseSliceStatement(li),
  [PRINT]: (li: List<Token>) => parsePrintStatement(li),
  [CONCAT]: (li: List<Token>) => parseConcatStatement(li),
  [LENGTH]: (li: List<Token>) => parseLengthStatement(li),
  [LET]: (li: List<Token>) => parseLetStatement(li),
  [IF]: (li: List<Token>) => parseIfStatement(li),
};

function parseStatement(li: List<Token>) {
  const currentToken = li.head();
  return currentToken.type in statementTypes
    ? statementTypes[currentToken.type](li)
    : parseExpressionStatement(li);
}
