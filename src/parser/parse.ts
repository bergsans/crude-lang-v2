import { Tokens, Token } from '../lexer/tokenize';
import {
  characterNames,
  SEMICOLON,
  ASSIGN,
  BOOLEAN,
  EOF,
  INTEGER,
  NIL,
  IDENTIFIER,
} from '../lexer/token-types';
import {
  BinaryExpression,
  LiteralExpression,
  LetDeclaration,
  ExpressionStatement,
  Program,
  precedence,
} from './parse-types';
import { isOperatorType, isPeekToken } from '../utils/predicates';
import { list, List } from '../utils/list';

type Value = Token;
type Left = NodeTree;
type Right = Left;

export interface NodeTree {
  left: Left;
  value: Value;
  right: Right;
}

interface Expression extends NodeTree {}

interface Identifier {
  type: string;
  name: string;
}

interface Statement {
  type: typeof LetDeclaration | typeof ExpressionStatement;
  statement: Statement;
  id?: Identifier;
  expression?: Expression;
}

interface AST {
  type: 'Program';
  body: Statement[];
}

type TokenList = List<Token>;

function Tree(left: Left, node: Token, right: Right) {
  return {
    left,
    value: node,
    right,
  };
}

function nud(li: TokenList, node: Token) {
  if (node.type === 'L_PAREN') {
    const expression = parseBinaryExpression(li, 0);
    li.rm();
    return expression;
  }
  return Tree(null, node, null);
}

function led(li: TokenList, left: Left, operator: Token) {
  return Tree(
    left,
    operator,
    parseBinaryExpression(li, precedence[operator.type])
  );
}

function parseBinaryExpression(li: TokenList, currentPrecedence = 0) {
  let left = nud(li, li.rm());
  if (li.head().type === 'SEMICOLON') {
    return left;
  }
  while (precedence[li.head().type] > currentPrecedence) {
    left = led(li, left, li.rm());
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

export function _parseBinaryExpression(li: List<Token>) {
  const result = parseBinaryExpression(li, 0);
  const purifiedNode = removeDeadNodes(result);
  return {
    type: BinaryExpression,
    ...purifiedNode,
  };
}

const getTruthiness = (value: string) => (value === 'true' ? true : false);

export function parseLiteralExpression(token: Token) {
  return {
    type: ExpressionStatement,
    expression: {
      ...token,
      type: LiteralExpression,
      value:
        token.type === 'INTEGER'
          ? parseInt(token.literal, 10)
          : getTruthiness(token.literal),
    },
  };
}

export function parseExpressionStatement(li: List<Token>) {
  if (
    (isPeekToken(li.head(), INTEGER) || isPeekToken(li.head(), BOOLEAN)) &&
    isPeekToken(li.lookAt(1), characterNames[SEMICOLON])
  ) {
    return parseLiteralExpression(li.head());
  }
  if (isPeekToken(li.head(), INTEGER) && isOperatorType(li.lookAt(1).type)) {
    return _parseBinaryExpression(li);
  }
  return NIL;
}

export function parse(tokens: Tokens): AST {
  const statements = [];
  const li = list(tokens);
  let currentToken = li.rm();
  while (currentToken.type !== EOF) {
    const statement = parseStatement(currentToken, li);
    if (statement !== NIL) {
      statements.push(statement);
    }
    // remove: todo! fix EOF bug
    currentToken = li.rm() ?? ({ type: EOF } as Token);
  }
  return {
    type: Program,
    body: statements,
  };
}

export function parseLetStatement(li: List<Token>) {
  let currentToken = li.rm();
  if (currentToken.type !== IDENTIFIER) {
    return NIL;
  }
  const id = {
    type: IDENTIFIER,
    name: currentToken.literal,
  };
  currentToken = li.rm();
  if (currentToken.type !== characterNames[ASSIGN]) {
    return NIL;
  }
  const statement = parseExpressionStatement(li);
  li.rm();
  li.rm();
  return { type: LetDeclaration, id, statement };
}

function parseStatement(token: Token, li: List<Token>) {
  if (token.type === 'LET') {
    return parseLetStatement(li);
  }
  li.rm();
  return parseExpressionStatement(li);
}
