export const NUL = '\0';
export const NIL = undefined;
export const DEFINE = 'DEFINE';
export const SLICE = 'SLICE';
export const LENGTH = 'LENGTH';
export const SET = 'SET';
export const CONCAT = 'CONCAT';
export const CHANGE = 'CHANGE';
export const CONVERT = 'CONVERT';
export const PRINT = 'PRINT';
export const QUOTE_SIGN = '"';
export const EOF = 'EOF';
export const IF = 'IF';
export const LET = 'LET';
export const FOR = 'FOR';
export const RETURN_STATEMENT = 'RETURN';
export const COMMA = ',';
export const L_BRACKET = '[';
export const R_BRACKET = ']';
export const L_PAREN = '(';
export const R_PAREN = ')';
export const PLUS = '+';
export const MULTIPLICATION = '*';
export const MINUS = '-';
export const MODULO = '%';
export const POWER = '^';
export const DIVISION = '/';
export const EQUAL = '==';
export const BANG = '!';
export const NOT_EQUAL = '!=';
export const IDENTIFIER = 'IDENTIFIER';
export const BOOLEAN = 'BOOLEAN';
export const INTEGER = 'INTEGER';
export const ASSIGN = '=';
export const SEMICOLON = ';';
export const UNALLOWED_CHARACTER = 'UNALLOWED_CHARACTER';
export const GREATER_THAN = '>';
export const LOWER_THAN = '<';
export const GREATER_THAN_OR_EQUAL = '>=';
export const LOWER_THAN_OR_EQUAL = '<=';
export const AND_SIGN = '&';
export const OR_SIGN = '|';
export const AND = '&&';
export const OR = '||';
export const NEW_LINE = '\n';
export const RETURN = '\r';
export const SPACE = ' ';
export const TAB = '\t';
export const L_BRACE = '{';
export const R_BRACE = '}';

export const characterNames = {
  [MULTIPLICATION]: 'MULTIPLICATION',
  [DIVISION]: 'DIVISION',
  [PLUS]: 'PLUS',
  [MODULO]: 'MODULO',
  [POWER]: 'POWER',
  [MINUS]: 'MINUS',
  [BANG]: 'NOT',
  [GREATER_THAN]: 'GREATER_THAN',
  [LOWER_THAN]: 'LOWER_THAN',
  [LOWER_THAN_OR_EQUAL]: 'LOWER_THAN_OR_EQUAL',
  [GREATER_THAN_OR_EQUAL]: 'GREATER_THAN_OR_EQUAL',
  [EQUAL]: 'EQUAL',
  [NOT_EQUAL]: 'NOT_EQUAL',
  [ASSIGN]: 'ASSIGN',
  [L_PAREN]: 'L_PAREN',
  [R_PAREN]: 'R_PAREN',
  [SEMICOLON]: 'SEMICOLON',
  [COMMA]: 'COMMA',
  [AND]: 'AND',
  [OR]: 'OR',
  [QUOTE_SIGN]: 'QUOTE_SIGN',
  [L_BRACE]: 'L_BRACE',
  [R_BRACE]: 'R_BRACE',
  [L_BRACKET]: 'L_BRACKET',
  [R_BRACKET]: 'R_BRACKET',
};
