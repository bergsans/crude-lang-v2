import { Token } from '../lexer/tokenize';
import { precedence, END_OF_STATEMENT } from './parse-types';
import {
  isSliceStatement,
  isConcatStatement,
  isLengthStatement,
  isArithmeticInfix,
  isGroupedExpression,
  isCallExpression,
} from '../utils/predicates';
import { List } from '../utils/list';
import { parseConcatStatement } from './parse-concat-statement';
import { parseSliceStatement } from './parse-slice-statement';
import { parseLengthStatement } from './parse-length-statement';
import { parseCallExpression } from './parse-call-expression';
import { Expression } from './parse-expression-statement';

export interface NodeTree {
  left: any;
  value: any; // Operator
  right: any;
}

export interface BinaryExpression extends NodeTree {
  type: 'BinaryExpression';
}

type NudPredicate = (li: List<Token>) => boolean;

type NudProducer = any; // Fix node types

type NudHandler = [NudPredicate, NudProducer];

function tree(left: any, node: any, right: any) {
  return {
    left,
    value: node,
    right,
  };
}

function produceGroupedExpressionNUD(li: List<Token>) {
  li.next();
  const expression = parseBinaryExpression(li, 0);
  li.next();
  return expression;
}

function produceArithmeticInfixNUD(li: List<Token>) {
  const sign = li.next().literal;
  const node = li.next();
  node.literal = sign + node.literal;
  return tree(null, node, null);
}

function produceConcatStatementNUD(li: List<Token>) {
  const expression = parseConcatStatement(li);
  return tree(null, expression, null);
}

function produceSliceStatementNUD(li: List<Token>) {
  const expression = parseSliceStatement(li);
  return tree(null, expression, null);
}

function produceLengthStatementNUD(li: List<Token>) {
  const expression = parseLengthStatement(li);
  return tree(null, expression, null);
}

function produceCallExpressionNUD(li: List<Token>) {
  const callExpression = parseCallExpression(li);
  return tree(null, callExpression, null);
}

const nudHandler: NudHandler[] = [
  [isGroupedExpression, produceGroupedExpressionNUD],
  [isArithmeticInfix, produceArithmeticInfixNUD],
  [isSliceStatement, produceSliceStatementNUD],
  [isConcatStatement, produceConcatStatementNUD],
  [isLengthStatement, produceLengthStatementNUD],
  [isCallExpression, produceCallExpressionNUD],
];

function nud(li: List<Token>) {
  for (const [predicate, producer] of nudHandler) {
    if (predicate(li)) {
      return producer(li);
    }
  }
  return tree(null, li.next(), null);
}

function led(li: List<Token>, left: Expression, operator: Token) {
  return tree(
    left,
    operator,
    parseBinaryExpression(li, precedence[operator.type])
  );
}

function parseBinaryExpression(li: List<Token>, currentPrecedence = 0) {
  let left = nud(li);
  if (li.isHead(END_OF_STATEMENT)) {
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

export function _parseBinaryExpression(li: List<Token>): BinaryExpression {
  const result = parseBinaryExpression(li);
  if (li.head().type === END_OF_STATEMENT) {
    li.next();
  }
  const purifiedNode: NodeTree = removeDeadNodes(result);
  return {
    type: 'BinaryExpression',
    ...purifiedNode,
  };
}
