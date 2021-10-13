import { fmtStr } from 'crude-dev-tools';

const arithmetics = {
  PLUS: (a: number, b: number) => a + b,
  MINUS: (a: number, b: number) => a - b,
  MULTIPLICATION: (a: number, b: number) => a * b,
  MODULO: (a: number, b: number) => a % b,
  POWER: (a: number, b: number) => a ** b,
  DIVISION: (a: number, b: number) => {
    if (b === 0) {
      throw new Error(fmtStr('Division by zero is not allowed', 'red'));
    }
    return Math.round(a / b);
  },
};

const logic = {
  AND: (a: boolean, b: boolean) => a && b,
  OR: (a: boolean, b: boolean) => a || b,
  NOT: (a: boolean) => !a,
};

const comparators = {
  GREATER_THAN: (a: number, b: number) => a > b,
  LOWER_THAN: (a: number, b: number) => a < b,
  GREATER_THAN_OR_EQUAL: (a: number, b: number) => a >= b,
  LOWER_THAN_OR_EQUAL: (a: number, b: number) => a <= b,
  EQUAL: <T>(a: T, b: T) => a === b,
  NOT_EQUAL: <T>(a: T, b: T) => a !== b,
};

export const operations = { ...arithmetics, ...comparators, ...logic };
