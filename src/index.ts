import { tokenize } from './lexer/tokenize';
import { parse } from './parser/parse';
import { evaluate, environment } from './evaluator/evaluate';

export default {
  tokenize,
  parse,
  environment,
  evaluate,
};
