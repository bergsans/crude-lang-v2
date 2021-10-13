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
  CONVERT,
  CHANGE,
  PRINT,
  FOR,
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
  produceBinaryExpression,
  produceIdentifierAndEndOfStatement,
  produceInfixNotAndGroupedExpression,
  produceArithmeticOperatorAndGroupedExpression,
  parseGroupedExpression,
} from './parse-helpers';
import {
  isPeekToken,
  isArithmeticOperatorAndGroupedExpression,
  isPrimitiveAndEndOfStatement,
  isPartOfBinaryExpression,
  isIdentifierAndEndOfStatement,
  isSliceStatement,
  isArray,
  isArrayIndex,
  isConvertStatement,
  isChangeStatement,
  isConcatStatement,
  isLengthStatement,
  isCallExpression,
  isPrimitive,
  isInfixNotAndBoolean,
  isInfixNotAndGroupedExpression,
} from '../utils/predicates';
import { list, List } from '../utils/list';
import { fmtStr } from 'crude-dev-tools';

export type Value = Token;

export type Left = NodeTree;

export type Right = Left;

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

type ParseExpressionPredicate = (li: List<Token>) => boolean;

type ParseExpressionProducer = any; // Fix node types

type ParseExpressionHandler = [
  ParseExpressionPredicate,
  ParseExpressionProducer
];

const parseExpressionHandlers: ParseExpressionHandler[] = [
  [isSliceStatement, produceSliceStatement],
  [isConvertStatement, parseConvertStatement],
  [isChangeStatement, parseChangeStatement],
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
  [isPartOfBinaryExpression, produceBinaryExpression],
  [isPrimitive, producePrimitive],
  [isIdentifierAndEndOfStatement, produceIdentifierAndEndOfStatement],
];

export function parse(tokens: Tokens, stdLib?) {
  const li = list(tokens);
  const statements = parseBlockStatement(li);
  return {
    type: Program,
    body: stdLib ? [].concat(stdLib, statements) : statements,
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

export function parseForStatement(li: List<Token>) {
  li.next();
  const id = li.get()[1];
  const [, start, end] = parseGroupedExpression(3, li);
  if (li.head().type !== 'L_BRACE') {
    throw new Error(fmtStr('Expected block statement.', 'red'));
  }
  li.next();
  const c = { type: BlockStatement, statements: parseBlockStatement(li) };
  const action = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: 'For',
    id,
    start,
    end,
    action,
  };
}

export function parseIfStatement(li: List<Token>) {
  if (li.head().type === 'IF') {
    li.next();
  }
  if (li.head().type !== 'L_PAREN') {
    throw new Error(fmtStr('Expected grouped expression.', 'red'));
  }
  li.next();
  const condition = parseExpressionStatement(li);
  li.next();
  if (li.head().type !== 'L_BRACE') {
    throw new Error(fmtStr('Expected block statement.', 'red'));
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
  const [value, start, end] = parseGroupedExpression(3, li);
  return {
    type: 'Slice',
    value,
    start,
    end,
  };
}

export function parseChangeStatement(li: List<Token>) {
  li.next();
  const [array, index, newValue] = parseGroupedExpression(3, li);
  if (li.head().type === 'SEMICOLON') {
    li.next();
  }
  return {
    type: 'Change',
    array,
    index,
    newValue,
  };
}

export function parseConvertStatement(li: List<Token>) {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  if (li.head().type === 'SEMICOLON') {
    li.next();
  }
  return {
    type: 'Convert',
    value,
  };
}

export function parsePrintStatement(li: List<Token>) {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  if (li.head().type === 'SEMICOLON') {
    li.next();
  }
  return {
    type: 'Print',
    value,
  };
}

export function parseConcatStatement(li: List<Token>) {
  li.next();
  const [firstValue, secondValue] = parseGroupedExpression(2, li);
  return {
    type: 'Concat',
    args: [firstValue, secondValue],
  };
}

export function parseLengthStatement(li: List<Token>) {
  li.next();
  const [value] = parseGroupedExpression(1, li);
  return {
    type: 'Length',
    value,
  };
}

export function parseDefinitionStatement(li: List<Token>) {
  li.next();
  const name = li.next();
  if (name.type !== IDENTIFIER) {
    throw new Error(fmtStr('Expected definition name.', 'red'));
  }
  if (!isPeekToken(li.head(), 'L_PAREN')) {
    throw new Error(fmtStr('Expected opening parenthesis.', 'red'));
  }
  li.next();
  const params = [];
  while (!isPeekToken(li.head(), 'R_PAREN')) {
    if (!isPeekToken(li.head(), IDENTIFIER)) {
      throw new Error(fmtStr('Expected definition parameter.', 'red'));
    }
    const currentToken = li.next();
    params.push(currentToken);
    if (isPeekToken(li.head(), 'COMMA')) {
      li.next();
    }
  }
  li.next();
  if (!isPeekToken(li.head(), 'L_BRACE')) {
    throw new Error(fmtStr('Expected definition body.', 'red'));
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
  [CONVERT]: (li: List<Token>) => parseConvertStatement(li),
  [CHANGE]: (li: List<Token>) => parseChangeStatement(li),
  [FOR]: (li: List<Token>) => parseForStatement(li),
  [PRINT]: (li: List<Token>) => parsePrintStatement(li),
  [CONCAT]: (li: List<Token>) => parseConcatStatement(li),
  [LENGTH]: (li: List<Token>) => parseLengthStatement(li),
  [LET]: (li: List<Token>) => parseLetStatement(li),
  [IF]: (li: List<Token>) => parseIfStatement(li),
};

export function parseStatement(li: List<Token>) {
  const currentToken = li.head();
  return currentToken.type in statementTypes
    ? statementTypes[currentToken.type](li)
    : parseExpressionStatement(li);
}
