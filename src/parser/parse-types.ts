export const ExpressionStatement = 'ExpressionStatement';
export const BinaryExpression = 'BinaryExpression';
export const LiteralExpression = 'LiteralExpression';
export const LetDeclaration = 'LetDeclaration';
export const Program = 'Program';

export const precedence = {
  R_PAREN: 0,
  EQUAL: 1,
  NOT_EQUAL: 1,
  GT: 1,
  LT: 1,
  PLUS: 1,
  MINUS: 1,
  DIV: 2,
  MULTIPLICATION: 2,
  // BANG: 3,
  // L_PAREN: 4,
};
