export const UnaryExpression = 'UnaryExpression';
export const ExpressionStatement = 'ExpressionStatement';
export const BinaryExpression = 'BinaryExpression';
export const LiteralExpression = 'LiteralExpression';
export const LetDeclaration = 'LetDeclaration';
export const Program = 'Program';

export const INFIX_ARITHMETIC_TYPES = ['MINUS', 'PLUS'];
export const LITERAL_PRIMITIVES = ['BOOLEAN', 'INTEGER'];
export const INFIX_NOT = 'NOT';
export const END_OF_STATEMENT = 'SEMICOLON';
export const OPEN_GROUPED_EXPRESSION = 'L_PAREN';

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
  DIVISION: 2,
  MULTIPLICATION: 2,
  NOT: 3,
};
