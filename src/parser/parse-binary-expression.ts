import { Token } from '../lexer/tokenize';
import { BinaryExpression, precedence, END_OF_STATEMENT } from './parse-types';
import {
  isGroupedExpression,
  isSliceStatement,
  isConcatStatement,
  isLengthStatement,
  isArithmeticInfix,
  isCallExpression,
} from '../utils/predicates';
import { List } from '../utils/list';
import {
  parseConcatStatement,
  parseLengthStatement,
  parseCallExpression,
  parseSliceStatement,
  Left,
  NodeTree,
} from './parse';
import { produceCallExpression } from './parse-helpers';

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

function led(li: List<Token>, left: Left, operator: Token) {
  return tree(
    left,
    operator,
    parseBinaryExpression(li, precedence[operator.type])
  );
}

function parseBinaryExpression(li: List<Token>, currentPrecedence = 0) {
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