import { tokenize } from './lexer/tokenize';
import { parse } from './parser/parse';
import { evaluate } from './evaluator/evaluate';

const interpret = (input: string) => evaluate(parse(tokenize(input)));

export default {
  tokenize,
  parse,
  evaluate,
  interpret,
};
