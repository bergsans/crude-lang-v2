import { Tokens, Token } from '../lexer/tokenize';
import {
  characterNames,
  SEMICOLON,
  LET,
  ASSIGN,
  RETURN_STATEMENT,
  BOOLEAN,
  EOF,
  IF,
  INTEGER,
  NIL,
  IDENTIFIER,
} from '../lexer/token-types';
import {
  UnaryExpression,
  BinaryExpression,
  LetDeclaration,
  ExpressionStatement,
  Program,
  precedence,
  INFIX_ARITHMETIC_TYPES,
  INFIX_NOT,
  END_OF_STATEMENT,
  OPEN_GROUPED_EXPRESSION,
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

export interface Expression extends NodeTree {
  type: string;
  literal: string;
  expression: Expression;
  argument?: Expression;
}

interface Identifier {
  type: string;
  name: string;
}

export interface Statement {
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
  if (node.type === OPEN_GROUPED_EXPRESSION) {
    const expression = parseBinaryExpression(li, 0);
    li.next();
    return expression;
  }
  if (INFIX_ARITHMETIC_TYPES.includes(node.type)) {
    const sign = node.literal;
    node = li.next();
    node.literal = sign + node.literal;
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
  let left = nud(li, li.next());
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

export function parse(tokens: Tokens): AST {
  const li = list(tokens);
  const statements = parseBlockStatement(li);
  return {
    type: Program,
    body: statements,
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

export function parseExpressionStatement(li: List<Token>) {
  if (
    (isPeekToken(li.head(), INTEGER) || isPeekToken(li.head(), BOOLEAN)) &&
    isPeekToken(li.lookAt(1), 'SEMICOLON')
  ) {
    const currentToken = li.next();
    li.next();
    return parseLiteralExpression(currentToken);
  }
  if (isPeekToken(li.head(), INFIX_NOT) && li.lookAt(1).type === BOOLEAN) {
    li.next();
    return {
      type: UnaryExpression,
      literal: INFIX_NOT,
      argument: parseExpressionStatement(li),
    };
  }
  if (
    isPeekToken(li.head(), INFIX_NOT) &&
    li.lookAt(1).type === OPEN_GROUPED_EXPRESSION
  ) {
    li.next();
    return {
      type: UnaryExpression,
      literal: INFIX_NOT,
      argument: parseExpressionStatement(li),
    };
  }
  if (
    INFIX_ARITHMETIC_TYPES.includes(li.head().type) &&
    li.lookAt(1).type === OPEN_GROUPED_EXPRESSION
  ) {
    const type = li.head().type;
    li.next();
    return {
      type: UnaryExpression,
      literal: type,
      argument: parseExpressionStatement(li),
    };
  }
  if (
    isPeekToken(li.head(), INTEGER) ||
    isPeekToken(li.head(), IDENTIFIER) ||
    (isPeekToken(li.head(), BOOLEAN) && isOperatorType(li.lookAt(1).type)) ||
    isPeekToken(li.head(), OPEN_GROUPED_EXPRESSION) ||
    INFIX_ARITHMETIC_TYPES.includes(li.head().type)
  ) {
    return _parseBinaryExpression(li);
  }
  if (li.head().type === IDENTIFIER && li.lookAt(1).type === SEMICOLON) {
    const currentToken = li.next();
    li.next();
    return {
      type: 'Identifier',
      name: currentToken.literal,
    };
  }
  return NIL;
}

export function parseLetStatement(li: List<Token>) {
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
  //li.next();
  //li.next();
  return { type: LetDeclaration, id, statement };
}

function parseBlockStatement(li: List<Token>) {
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
  const c = { type: 'BlockStatement', statements: parseBlockStatement(li) };
  const consequence = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: 'IfStatement',
    condition,
    consequence,
  };
}

export function parseReturnStatement(li: List<Token>) {
  return {
    type: 'ReturnStatement',
    value: parseExpressionStatement(li),
  };
}

function parseStatement(li: List<Token>) {
  const token = li.next();
  if (token.type === RETURN_STATEMENT) {
    return parseReturnStatement(li);
  }
  if (token.type === LET) {
    return parseLetStatement(li);
  }
  if (token.type === IF) {
    return parseIfStatement(li);
  }
  return parseExpressionStatement(li);
}
