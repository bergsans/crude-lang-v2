export const ExpressionStatement = 'ExpressionStatement';
export const BinaryExpression = 'BinaryExpression';
export const LiteralExpression = 'LiteralExpression';
export const LetDeclaration = 'LetDeclaration';
export const Program = 'Program';

export const precedence = {
  R_PAREN: 0,
  EQUAL: 1,
  NOT_EQUAL: 1,
  GREATER_THAN: 1,
  LOWER_THAN: 1,
  GREATER_THAN_OR_EQUAL: 1,
  LOWER_THAN_OR_EQUAL: 1,
  PLUS: 1,
  MINUS: 1,
  DIV: 2,
  MULTIPLICATION: 2,
  // BANG: 3,
};
