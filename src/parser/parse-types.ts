export const INFIX_ARITHMETIC_TYPES = ['MINUS', 'PLUS'];
export const INFIX_NOT = 'NOT';
export const END_OF_STATEMENT = 'SEMICOLON';

export const precedence = {
  R_PAREN: 0,
  AND: 1,
  OR: 1,
  PLUS: 3,
  MINUS: 3,
  EQUAL: 2,
  NOT_EQUAL: 2,
  GREATER_THAN: 2,
  LOWER_THAN: 2,
  GREATER_THAN_OR_EQUAL: 2,
  LOWER_THAN_OR_EQUAL: 2,
  MODULO: 4,
  DIVISION: 4,
  MULTIPLICATION: 4,
  POWER: 5,
  NOT: 5,
  L_PAREN: 6,
};
