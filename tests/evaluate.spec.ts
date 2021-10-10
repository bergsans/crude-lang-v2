import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import {
  _parseBinaryExpression,
  parseExpressionStatement,
  parse,
} from '../src/parser/parse';
import {
  Environment,
  evaluateBinaryExpression,
  evaluate,
} from '../src/evaluator/evaluate';
import { list } from '../src/utils/list';

type Example = [string, any];

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
      it(`${code} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = parseExpressionStatement(li);
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
      it(`${code} is ${expectedResult}`, () => {
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
      it(`${code} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = _parseBinaryExpression(li);
        const result = evaluateBinaryExpression(parsed, {} as Environment);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Arithmetic Operations', () => {
    const examples: Example[] = [
      ['4;', 4],
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
      it(`${code} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const li = list(tokens);
        const parsed = parseExpressionStatement(li);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('LetDeclaration', () => {
    const examples: Example[] = [
      [
        `
let x = 3;
let y = 44;
return y;
      }`,
        44,
      ],
      [
        `
let x = 3;
return x + 3;
      }`,
        6,
      ],
      [
        `
if(3 > 2) {
  let x = 3;
}
return x;
      }`,
        false,
      ],
      [
        `
let x = 3;
if(3 > 2) {
  let y = 3;
}
return x;
      }`,
        3,
      ],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.trim().replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('If statement', () => {
    const examples: Example[] = [
      [
        `
      if(5 > 3) {
      return 55;
      }`,
        55,
      ],
      [
        `
let x = 5;
let y = 4;
if(x > y) {
  return 55;
}
return 44;`,
        55,
      ],
      [
        `
if(5 > 3) {
  if(10 > 4) {
    return 999;
  }
  return 666;
}`,
        999,
      ],
      [
        `
      if(5 > 3 && 4 < 6) {
      return 55;
      }`,
        55,
      ],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.trim().replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Return statement', () => {
    const examples: Example[] = [
      ['if(1 < 2) { let x = 3; let y = 4; return x; }', 3],
      ['if(1 < 2) { let x = 3; let y = 4; return x + y; }', 7],
      ['if(1 < 2) { return 555; }', 555],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe.only('Define statement & call expression', () => {
    const examples: Example[] = [
      ['define add(a, b) { return a + b; } return add(1, 3);', 4],
      ['define add(a, b) { return a + b; } return add(add(1, 1), 3);', 5],
      ['define add(a, b) { return a + b; } return add(1, 3) + 1;', 5],
      ['define add(a, b) { return a + b; } return add(1 + 5, 3);', 9],
      //[
      //`
      //define add(a, b) {
      //return a + b;
      //}
      //define inc(x) {
      //return x + 1;
      //}
      //return add(1, inc(1));`,
      //3,
      //],
      ['define isOdd(x) { return x % 2 != 0; } return isOdd(5);', true],
      [
        `
define factorial(x) {
  if(x == 0) {
    return 1;
  }
  return x * factorial(x - 1);
}
return factorial(10);`,
        3628800,
      ],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code as string);
        const parsed = parse(tokens);
        // console.log(JSON.stringify(parsed, null, 2));
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });
});
