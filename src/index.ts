import { tokenize } from './lexer/tokenize';
import { parse } from './parser/parse';
import { evaluate } from './evaluator/evaluate';
import { environment } from './evaluator/environment';
export default {
  tokenize,
  parse,
  environment,
  evaluate,
};
