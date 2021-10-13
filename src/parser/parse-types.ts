export const UnaryExpression = 'UnaryExpression';
export const ExpressionStatement = 'ExpressionStatement';
export const BinaryExpression = 'BinaryExpression';
export const CallExpression = 'CallExpression';
export const LiteralExpression = 'LiteralExpression';
export const LetDeclaration = 'LetDeclaration';
export const IfStatement = 'IfStatement';
export const ReturnStatement = 'ReturnStatement';
export const BlockStatement = 'BlockStatement';
export const Program = 'Program';
export const DefinitionStatement = 'DefinitionStatement';

export const INFIX_ARITHMETIC_TYPES = ['MINUS', 'PLUS'];
export const LITERAL_PRIMITIVES = ['STRING', 'BOOLEAN', 'INTEGER'];
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
  MODULO: 2,
  DIVISION: 2,
  MULTIPLICATION: 2,
  POWER: 3,
  NOT: 3,
  L_PAREN: 4,
};
