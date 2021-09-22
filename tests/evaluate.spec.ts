import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import {
  _parseBinaryExpression,
  parseExpressionStatement,
} from '../src/parser/parse';
import { evaluateBinaryExpression, evaluate } from '../src/evaluator/evaluate';
import { list } from '../src/utils/list';

type Example = [string, any];

const formatCodeString = (code: string) => code.slice(code.length - 2);

describe('Evaluate', () => {
  describe('Logical operators - Truth Table', () => {
    const truthTable: Example[] = [
      ['true && true;', true],
      ['true && false;', false],
      ['true || false;', true],
      ['false || false;', false],
      ['!true;', false],
      ['!false;', true],
      ['!(true);', false],
      ['!(false);', true],
    ];
    for (const [code, expectedResult] of truthTable) {
      it(`${formatCodeString(code)} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = parseExpressionStatement(li);
        console.log(code, parsed);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Equality Operators', () => {
    const examples: Example[] = [
      ['4 == 4;', true],
      ['4 != 4;', false],
      ['4 == 2;', false],
      ['4 != 2;', true],
      ['!(2 + 2 == 4);', false],
      ['!(2 + 2 == 5);', true],
      ['2 + 2 == 4;', true],
      ['2 + 2 == 5;', false],
      ['2 + 2 != 5;', true],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${formatCodeString(code)} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = parseExpressionStatement(li);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Comparison Operators', () => {
    const examples: Example[] = [
      ['4 < 5 && 5 > 4;', true],
      ['4 < 5 && 5 > 6;', false],
      ['6 < 5 || 5 > 6;', false],
      ['3 <= 3;', true],
      ['2 <= 3;', true],
      ['3 <= 2;', false],
      ['3 >= 3;', true],
      ['3 >= 2;', true],
      ['3 <= 2;', false],
      ['4 % 2 == 0;', true],
      ['4 % 3 == 0;', false],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${formatCodeString(code)} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Arithmetic Operations', () => {
    const examples: Example[] = [
      ['4 + 4 * 4;', 20],
      ['-3 + 3;', 0],
      ['2 * -2;', -4],
      ['4 + 4 + -2 + 2;', 8],
      ['4 - -2;', 6],
      ['4 - 2;', 2],
      ['(4 - 1) * 3;', 9],
      ['4 + +5;', 9],
      ['+(4);', 4],
      ['-(-4);', 4],
      ['-(4);', -4],
      ['4 / 2;', 2],
      ['4 / 3;', 1],
      ['4^2;', 16],
      ['2 * 4^2;', 32],
      ['4 + (5 - 3 + (3 - 2));', 7],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${formatCodeString(code)} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = parseExpressionStatement(li);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });
});
