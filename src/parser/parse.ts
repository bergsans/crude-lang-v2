import { Tokens, Token } from '../lexer/tokenize';
import {
  characterNames,
  LET,
  L_PAREN,
  SEMICOLON,
  ASSIGN,
  EOF,
  INTEGER,
  NIL,
  IDENTIFIER,
} from '../lexer/token-types';
import {
  BinaryExpression,
  LiteralExpression,
  ExpressionStatement,
  precedence,
} from './parse-types';
import { isPeekToken } from '../utils/predicates';
import { list, List } from '../utils/list';

type Value = Token;
type Left = NodeTree;
type Right = Left;

interface NodeTree {
  left: Left;
  value: Value;
  right: Right;
}

interface Expression extends Value {}

interface Statement {
  tokens: Token[];
  value: Expression;
}

interface AST {
  program: Statement[];
}

type TokenList = List<Token>;

function Tree(left: Left, node: Token, right: Right) {
  return {
    left,
    value: node,
    right,
  };
}

function nud(bt: TokenList, node: Token) {
  if (node.type === characterNames[L_PAREN]) {
    bt.rm();
    return parseBinaryExpression(bt);
  }
  return Tree(null, node, null);
}

function led(bt: TokenList, left: Left, operator: Token) {
  return Tree(
    left,
    operator,
    parseBinaryExpression(bt, precedence[operator.type])
  );
}

function parseBinaryExpression(bt: TokenList, currentPrecedence = 0) {
  let left = nud(bt, bt.rm());
  if (bt.head().type === characterNames[SEMICOLON]) {
    return left;
  }
  while (precedence[bt.head().type] > currentPrecedence) {
    left = led(bt, left, bt.rm());
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

export function _parseBinaryExpression(ts: Token[]) {
  const bt = list(ts);
  const binaryExpressionAST = parseBinaryExpression(bt);
  return {
    type: BinaryExpression,
    ...removeDeadNodes(binaryExpressionAST),
  };
}

export function parseLiteralExpression(token: Token) {
  return {
    type: ExpressionStatement,
    expression: {
      ...token,
      type: LiteralExpression,
      value: parseInt(token.literal, 10),
    },
  };
}

export function parseExpressionStatement(tokens: Tokens) {
  if (
    tokens[0].type === characterNames[INTEGER] &&
    isPeekToken(tokens[0], characterNames[SEMICOLON])
  ) {
    return parseLiteralExpression(tokens[0]);
  }
  if (
    tokens[0].type === characterNames[INTEGER] &&
    isPeekToken(tokens[0], 'PLUS')
  ) {
    return {
      type: ExpressionStatement,
      expression: _parseBinaryExpression(tokens),
    };
  }
  return {
    value: NIL,
  };
}

export function parse(_tokens: Tokens): AST {
  const statements = [];
  let currentToken = _tokens.shift();
  while (currentToken.type !== EOF) {
    const { statement, tokens } = parseStatement(currentToken, _tokens);
    if (statement !== NIL) {
      statements.push(statement);
    }
    currentToken = tokens.shift();
  }
  return {
    program: statements,
  };
}

function parseLetStatement(tokens: Tokens) {
  if (!isPeekToken(tokens[0], IDENTIFIER)) {
    return NIL;
  }
  let currentToken = tokens.shift();
  const name = {
    token: currentToken,
    value: currentToken.literal,
  };
  currentToken = tokens.shift();
  if (!isPeekToken(tokens[0], ASSIGN)) {
    return NIL;
  }
  tokens.shift();
  const expression = parseExpressionStatement(tokens);
  const statement = { name, expression };
  return { statement, tokens };
}

function parseStatement(token: Token, tokens: Tokens) {
  if (token.type === characterNames[LET]) {
    return parseLetStatement(tokens);
  }
  return parseExpressionStatement(tokens);
}
