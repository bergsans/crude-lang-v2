export const INFIX_ARITHMETIC_TYPES = ['MINUS', 'PLUS'];
export const LITERAL_PRIMITIVES = ['STRING', 'BOOLEAN', 'INTEGER'];
export const INFIX_NOT = 'NOT';
export const END_OF_STATEMENT = 'SEMICOLON';

export const precedence = {
  R_PAREN: 0,
  AND: 1,
  OR: 1,
  PLUS: 1,
  MINUS: 1,
  EQUAL: 1,
  NOT_EQUAL: 1,
  GREATER_THAN: 2,
  LOWER_THAN: 2,
  GREATER_THAN_OR_EQUAL: 2,
  LOWER_THAN_OR_EQUAL: 2,
  MODULO: 2,
  DIVISION: 2,
  MULTIPLICATION: 2,
  POWER: 3,
  NOT: 3,
  L_PAREN: 4,
};
