import { tokenize } from './lexer/tokenize';
import { parse, parseExpressionStatement } from './parser/parse';
import { evaluate, environment, Environment } from './evaluator/evaluate';

const interpret = (input: string, env: Environment) =>
  evaluate(parse(tokenize(input)), env);

export default {
  tokenize,
  parse,
  parseExpressionStatement,
  interpret,
  evaluate,
  environment,
};
