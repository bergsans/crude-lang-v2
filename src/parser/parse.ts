import { Tokens, Token } from '../lexer/tokenize';
import {
  characterNames,
  LET,
  ASSIGN,
  RETURN_STATEMENT,
  IF,
  NIL,
  IDENTIFIER,
} from '../lexer/token-types';
import {
  UnaryExpression,
  BinaryExpression,
  LetDeclaration,
  ExpressionStatement,
  BlockStatement,
  IfStatement,
  ReturnStatement,
  Program,
  precedence,
  INFIX_ARITHMETIC_TYPES,
  INFIX_NOT,
  END_OF_STATEMENT,
  OPEN_GROUPED_EXPRESSION,
} from './parse-types';
import {
  isArithmeticOperatorAndGroupedExpression,
  isPrimitiveAndEndOfStatement,
  isPartOfBinaryExpression,
  isIdentifierAndEndOfStatement,
  isInfixNotAndBoolean,
  isInfixNotAndGroupedExpression,
} from '../utils/predicates';
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

export type BlockStatement = {
  type: string;
  statements: Statement[];
};

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

export interface AST {
  type: 'Program';
  body: Statement[];
}

type TokenList = List<Token>;

function tree(left: Left, node: Token, right: Right) {
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
  return tree(null, node, null);
}

function led(li: TokenList, left: Left, operator: Token) {
  return tree(
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

// TODO: refactor -> create predicates
export function parseExpressionStatement(li: List<Token>) {
  if (isPrimitiveAndEndOfStatement(li)) {
    const currentToken = li.next();
    li.next();
    return parseLiteralExpression(currentToken);
  }
  if (isInfixNotAndBoolean(li)) {
    li.next();
    return {
      type: UnaryExpression,
      literal: INFIX_NOT,
      argument: parseExpressionStatement(li),
    };
  }
  if (isInfixNotAndGroupedExpression(li)) {
    li.next();
    return {
      type: UnaryExpression,
      literal: INFIX_NOT,
      argument: parseExpressionStatement(li),
    };
  }
  if (isArithmeticOperatorAndGroupedExpression(li)) {
    const type = li.head().type;
    li.next();
    return {
      type: UnaryExpression,
      literal: type,
      argument: parseExpressionStatement(li),
    };
  }
  if (isPartOfBinaryExpression(li)) {
    return _parseBinaryExpression(li);
  }
  if (isIdentifierAndEndOfStatement(li)) {
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
  const c = { type: BlockStatement, statements: parseBlockStatement(li) };
  const consequence = { ...c, statements: c.statements.filter((n: any) => n) };
  return {
    type: IfStatement,
    condition,
    consequence,
  };
}

export function parseReturnStatement(li: List<Token>) {
  return {
    type: ReturnStatement,
    value: parseExpressionStatement(li),
  };
}

const statementTypes = {
  [RETURN_STATEMENT]: (li: List<Token>) => parseReturnStatement(li),
  [LET]: (li: List<Token>) => parseLetStatement(li),
  [IF]: (li: List<Token>) => parseIfStatement(li),
};

function parseStatement(li: List<Token>) {
  const currentToken = li.next();
  return currentToken.type in statementTypes
    ? statementTypes[currentToken.type](li)
    : parseExpressionStatement(li);
}
