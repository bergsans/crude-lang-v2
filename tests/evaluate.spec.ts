import { expect } from 'chai';
import { tokenize } from '../src/lexer/tokenize';
import { parse } from '../src/parser/parse';
import { parseExpressionStatement } from '../src/parser/parse-expression-statement';
import { _parseBinaryExpression } from '../src/parser/parse-binary-expression';
import {
  Environment,
  evaluateBinaryExpression,
  evaluate,
} from '../src/evaluator/evaluate';
import { list } from '../src/utils/list';
import importStdLib from '../src/utils/import-std-lib';

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
        const tokens = tokenize(code);
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
        const tokens = tokenize(code);
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
        const tokens = tokenize(code);
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
        const tokens = tokenize(code);
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
let n = 2;
if(n == 1 || n == 2) {
  return n;
}
return false;`,
        2,
      ],
      [
        `
if(3 > 2) {
  let x = 3;
}
return x;`,
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
        //console.log(JSON.stringify(parsed, null, 2));
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
      ['if("hello" == "hello") { return 3; }', 3],
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

  describe('string & slice statement', () => {
    const examples: Example[] = [
      ['return "Gandalf" + " " + "the White";', 'Gandalf the White'],
      ['return "Gandalf" + " " + "the White" == "Gandalf the White";', true],
      ['return "Gandal" == "Gandalf";', false],
      ['return "Gandal" != "Gandalf";', true],
      ['let len = length("hello"); if(len == 5) { return "true" }', 'true'],
      ['return length("hello");', 5],
      ['let name = "Gandalf"; return slice(name, 0, 1);', 'G'],
      [
        'let name = "Gandalf"; let len = length(name); return slice(name, 1, len);',
        'andalf',
      ],
      [
        'let first = slice("hello, world", 0, 1); if(first == "h") { return first; }',
        'h',
      ],
      ['return slice("hello, world", 7, 12);', 'world'],
      [
        'let name = "Gandalf"; let len = length(name); let newName = slice(name, 1, len); return newName;',
        'andalf',
      ],
      [
        'let world = slice("hello, world", 7, 12); if(world == "world") { return "hello"; }',
        'hello',
      ],
      ['return length("hello") + 5;', 10],
      ['let name = "Gandalf"; return length(name);', 7],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.equal(expectedResult);
      });
    }
  });

  describe('for statement', () => {
    const examples: Example[] = [
      [
        `
let arr = [];
for(x, 0, 3) {
  return change(arr, x, x + 1);
}
return arr;
`,
        [1, 2, 3],
      ],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.deep.equal(expectedResult);
      });
    }
  });

  describe('Change statement', () => {
    const examples: Example[] = [['change([1,2,3], 1, 3);', [1, 3, 3]]];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.deep.equal(expectedResult);
      });
    }
  });

  describe('Print statement - side effect (check manually)', () => {
    const examples: Example[] = [
      ['print(3);', undefined],
      ['let name = "Gandalf the White"; print(name);', undefined],
      [
        `
define printCountTo(n) {
  define loop(i) {
    if(i <= n) {
      print(i);
      return loop(i + 1);
    }
  }
  return loop(1);
}
return printCountTo(5);
`,
        undefined,
      ],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
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
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });

  describe('Using standard library', () => {
    const examples: Example[] = [
      ['change([1,2,3,4], 1, 666);', [1, 666, 3, 4]],
      ['let new = change([1,2,3,4], 1, 666); new;', [1, 666, 3, 4]],
      [
        'let ns = [1,2,3,4]; let new = change(ns, 1, 666); new;',
        [1, 666, 3, 4],
      ],
      ['filter(isOdd, [1,2,3,4,5]);', [1, 3, 5]],
      ['filter(isOdd, [1,2,3,4,5]);', [1, 3, 5]],
      ['map(inc, [1, 2, 3]);', [2, 3, 4]],
      // TODO: foldl(add, 0, concat(nums, someOtherNums)) doesn't work
      // foldl only takes evaluated list
      [
        `
let nums = [1,2,3,4,5];
let someOtherNums = map(inc, nums);
let concatenated = concat(nums, someOtherNums);
return foldl(add, 0, concatenated);
`,
        35,
      ],
      [
        `
define myMap(func, arr) {
  define concatAndFunc(l, el) {
    return concat(l, func(el));
  }
  return foldl(concatAndFunc, [], arr);
}
return myMap(inc, [1,2,3]);
`,
        [2, 3, 4],
      ],
      [
        `
define bubbleSort(arr) {
  for(i, 0, length(arr)) {
    for(j, 0, length(arr)) {
      let prevVal = arr[j];
      let nextVal = arr[j + 1];
      if(prevVal > nextVal) {
        let arr = change(arr, j, nextVal);
        return change(arr, j + 1, prevVal);
      }
    }
  }
  return arr;
}
bubbleSort([77, 33, 1, 5555, 33333, 3, 333, 0]);
`,
        [0, 1, 3, 33, 77, 333, 5555, 33333],
      ],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, async () => {
        const stdLib = await importStdLib();
        const tokens = tokenize(code);
        const parsed = parse(tokens, stdLib);
        const result = evaluate(parsed);
        expect(result).to.deep.equal(expectedResult);
      });
    }
  });

  describe('Arrays', () => {
    const examples: Example[] = [
      ['return [1, 2, 3];', [1, 2, 3]],
      ['let nums = [1, 2]; return nums;', [1, 2]],
      ['let nums = [1,2,3]; define id(x) { return x; } nums[0];', 1],
      ['let nums = [1, 2, 3, 4, 5]; return nums[2];', 3],
      ['let nums = [1, 2, 3]; return slice(nums, 1, length(nums));', [2, 3]],
      ['return length([1, 2, 3, 4]);', 4],
      ['return concat([1, 2, 3], [4]);', [1, 2, 3, 4]],
      ['let arr = [1,2,3]; let arr = change(arr, 1, 99); arr;', [1, 99, 3]],
      ['let arr = [1,2,3]; let arr = [3,2,1]; arr;', [3, 2, 1]],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.deep.equal(expectedResult);
      });
    }
  });

  describe('Define statement & call expression', () => {
    const examples: Example[] = [
      ['define add(a, b) { return a + b; } return add(1, 3);', 4],
      ['define add(a, b) { return a + b; } return add(add(1, 1), 3);', 5],
      ['define add(a, b) { return a + b; } return add(1, 3) + 1;', 5],
      ['define add(a, b) { return a + b; } return add(1 + 5, 3);', 9],
      [
        `
      define inc(x) {
      return x + 1;
      }

      define add(a, b) {
      return a + b;
      }
      return add(inc(1), 1);
      `,
        3,
      ],
      ['define isOdd(x) { return x % 2 != 0; } return isOdd(5);', true],
      [
        `
define factorial(x) {
  if(x == 0) {
    return 1;
  }
  return x * factorial(x - 1);
}
factorial(10);`,
        3628800,
      ],
      [
        `
define inc(x) {
  return x + 1;
}

define apply(fn, x) {
  return fn(x);
}
apply(inc, 3);
`,
        4,
      ],
      [
        `
define repeat(repeatMe, numTimes) {
  define count(n, str) {
    if(n == 0) {
      return str;
    }
    return count(n - 1, str + repeatMe);
  }
  return count(numTimes, "");
}
repeat("hello ", 4);
`,
        'hello hello hello hello ',
      ],
      [
        `
define trimStart(s) {
  define count(n) {
    if(slice(s, n, n + 1)!= " ") {
      let len = length(s);
      return slice(s, n, len);
    }
    return count(n + 1);
  }
  return count(0);
}
trimStart("  hello");
      `,
        'hello',
      ],
      [
        `
define isOdd(x) {
  return x % 2 != 0;
}

define filter(predicate, arr) {
  let filtArr = [];
  for(i, 0, length(arr)) {
    if(predicate(arr[i])) {
      return change(filtArr, length(filtArr), arr[i]);
    }
  }
  return filtArr;
}
filter(isOdd, [1, 2, 3, 4, 5, 6]);
`,
        [1, 3, 5],
      ],
      [
        `
define inc(x) {
  return x + 1;
}

define map(fn, arr) {
  let newArr = [];
  for(i, 0, length(arr)) {
    return change(newArr, i, fn(arr[i]));
  }
  return newArr;
}
map(inc, [1,2,3]);
`,
        [2, 3, 4],
      ],
      [
        `
define isOdd(x) {
  return x % 2 != 0;
}

define every(predicate, li) {
  define loop(i) {
    if(i < length(li)) {
      if(predicate(li[i]) == false) {
        return false;
      }
      return loop(i + 1);
    }
    return true;
  }
  return loop(0);
}
every(isOdd, [1,3,5]);
`,
        true,
      ],
      [
        `
define isOdd(x) {
  return x % 2 != 0;
}

define some(predicate, li) {
  define loop(i) {
    if(i < length(li)) {
      if(predicate(li[i]) == true) {
        return true;
      }
      return loop(i + 1);
    }
    return false;
  }
  return loop(0);
}
some(isOdd, [2,2,2,2,3,2]);
`,
        true,
      ],
      [
        `
define add(a, b) {
  return a + b;
}

define foldl(fn, curr, li) {
  define loop(i, currentValue) {
    if(i < length(li)) {
      return loop(i + 1, fn(currentValue, li[i]));
    }
    return currentValue;
  }
  return loop(0, curr);
}
foldl(add, 0, [1,2,3,4,5]);
`,

        15,
      ],
      [
        `
define fib(n) {
  if(n == 0) {
    return 0;
  }
  if(n == 1) {
    return 1;
  }
  return fib(n - 1) + fib(n - 2);
}
fib(11);
`,
        89,
      ],
      [
        `
define isOneOrTwo(n) {
  if((n == 1) || (n == 2)) {
    return n;
  }
  return false;
}
isOneOrTwo(1);
`,
        1,
      ],
      [
        `
define fib(n) {
  if((n == 0) || (n == 1)) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}
fib(11);
`,
        89,
      ],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.deep.equal(expectedResult);
      });
    }
  });

  describe('temp', () => {
    const examples: Example[] = [
      ['define a() { return 2; }', undefined],
      ['define a() { return 2; } a();', 2],
      ['define a() { return 2; } return a();', 2],
      ['let a = "1"; let b = convert(a); b;', 1],
      ['let a = 1; let b = convert(a); b;', '1'],
      ['return convert("66");', 66],
      ['return convert(66);', '66'],
      ['let a = 3; let a = 2; a;', 2],
    ];
    for (const [code, expectedResult] of examples) {
      it(`${code.replace(/\n/g, '')} is ${expectedResult}`, () => {
        const tokens = tokenize(code);
        const parsed = parse(tokens);
        const result = evaluate(parsed);
        expect(result).to.eq(expectedResult);
      });
    }
  });
});
