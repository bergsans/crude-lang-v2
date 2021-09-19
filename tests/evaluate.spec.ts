import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import {
  _parseBinaryExpression,
  parseExpressionStatement,
} from '../src/parser/parse';
import { evaluateBinaryExpression, evaluate } from '../src/evaluator/evaluate';
import { list } from '../src/utils/list';

describe('Evaluate', () => {
  describe('Logical operators - Truth Table', () => {
    const truthTable = [
      ['true && true;', true],
      ['true && false;', false],
      ['true || false;', true],
      ['false || false;', false],
      ['!true;', false],
      ['!false;', true],
    ];
    for (const [code, expectedResult] of truthTable) {
      it(`${code} is ${expectedResult}` as string, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = parseExpressionStatement(li);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Equality Operators', () => {
    const examples = [
      ['4 == 4;', true],
      ['4 != 4;', false],
      ['4 == 2;', false],
      ['4 != 2;', true],
      ['2 + 2 == 4;', true],
      ['2 + 2 == 5;', false],
      ['2 + 2 != 5;', true],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Comparison Operators', () => {
    const examples = [
      ['4 < 5 && 5 > 4;', true],
      ['4 < 5 && 5 > 6;', false],
      ['6 < 5 || 5 > 6;', false],
      ['3 <= 3;', true],
      ['2 <= 3;', true],
      ['3 <= 2;', false],
      ['3 >= 3;', true],
      ['3 >= 2;', true],
      ['3 <= 2;', false],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Arithmetic Operations', () => {
    const examples = [
      ['4 + 4 * 4;', 20],
      ['4 - 2;', 2],
      ['(4 - 1) * 3;', 9],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });
});
