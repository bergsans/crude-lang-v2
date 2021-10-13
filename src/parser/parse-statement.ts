import { Token } from '../lexer/tokenize';
import {
  LET,
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
} from '../lexer/token-types';
import { List } from '../utils/list';
import { parseSliceStatement } from './parse-slice-statement';
import { parseDefinitionStatement } from './parse-definition-statement';
import { parseConvertStatement } from './parse-convert-statement';
import { parseReturnStatement } from './parse-return-statement';
import { parseChangeStatement } from './parse-change-statement';
import { parseForStatement } from './parse-for-statement';
import { parsePrintStatement } from './parse-print-statement';
import { parseConcatStatement } from './parse-concat-statement';
import { parseLetStatement } from './parse-let-statement';
import { parseIfStatement } from './parse-if-statement';
import { parseLengthStatement } from './parse-length-statement';
import { parseExpressionStatement } from './parse-expression-statement';
import { Expression } from './parse';
import { Identifier } from './parse-literal-expression';

export interface Statement {
  type: 'Statement';
  statement: Statement;
  id?: Identifier;
  expression?: Expression;
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
