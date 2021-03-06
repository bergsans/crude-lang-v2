import { NUL } from './token-types';
import { throwCollectedErrors } from './token-errors';
import {
  isWhitespace,
  isDigit,
  isASCIIAlphabetic,
  isDisallowedToken,
  isSingleSign,
  isComparisonOperator,
  isNUL,
  isQuoteSign,
} from '../utils/predicates';
import {
  produceString,
  produceNULToken,
  produceComparisionOperatorToken,
  produceIdentifier,
  produceDisallowedCharacter,
  produceNumber,
  produceSingleSign,
  readCharacter,
} from './token-helpers';

export type TokenType = string;

export type Literal = string;

export interface Metadata {
  ln: number;
  col: number;
  realPosition: number;
}

export interface Token {
  type: TokenType;
  literal: Literal;
  meta: Metadata;
  name?: string;
}

export interface Data {
  input: string;
  currentPosition?: number;
  nextPosition: number;
  character: string;
  meta: Metadata;
  currentToken?: Token;
}

export interface NextToken extends Partial<Data> {
  name?: string;
  number?: string;
  string?: string;
}

type Predicate =
  | ((c: string) => boolean)
  | ((ch: string, inp: string, pos: number) => boolean);

type Producer = (
  input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) => { currentToken: Token; nextPosition: number };

type TokenHandler = [Predicate, Producer];

const defaultAlwaysTrue = () => true;

const tokenHandlers: TokenHandler[] = [
  [isNUL, produceNULToken],
  [isComparisonOperator, produceComparisionOperatorToken],
  [isSingleSign, produceSingleSign],
  [isASCIIAlphabetic, produceIdentifier],
  [isDigit, produceNumber],
  [isQuoteSign, produceString],
  [defaultAlwaysTrue, produceDisallowedCharacter],
];

export function peekCharacter(input: string, nextPosition: number) {
  return nextPosition >= input.length ? NUL : input[nextPosition];
}

function consumeWhitespace(
  input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  while (isWhitespace(character)) {
    const nextCharacter = readCharacter(input, nextPosition, meta);
    character = nextCharacter.character;
    nextPosition = nextCharacter.nextPosition;
    meta = nextCharacter.meta;
  }
  return { nextPosition, character, meta };
}

function nextToken(
  input: string,
  _currentPosition: number,
  _nextPosition: number,
  _character: string,
  _meta: Metadata
) {
  let currentToken: Token | undefined;
  let { nextPosition, character, meta } = consumeWhitespace(
    input,
    _nextPosition,
    _character,
    _meta
  );
  for (const [predicate, producer] of tokenHandlers) {
    if (predicate(character, input, nextPosition)) {
      const result = producer(input, nextPosition, character, meta);
      currentToken = result.currentToken;
      nextPosition = result.nextPosition;
      break;
    }
  }
  const nextCharacter = readCharacter(input, nextPosition, meta);
  return {
    ...nextCharacter,
    currentToken,
  };
}

function produceTokens(data: Data) {
  const tokens = [];
  while (data.character !== NUL) {
    data = {
      ...data,
      ...nextToken(
        data.input,
        data.currentPosition,
        data.nextPosition,
        data.character,
        data.meta
      ),
    };
    tokens.push(data.currentToken);
  }
  return tokens;
}

export function tokenize(input: string): Token[] {
  const initialMeta: Metadata = {
    realPosition: 0,
    col: 1,
    ln: 1,
  };
  let { character, currentPosition, nextPosition, meta } = readCharacter(
    input,
    0,
    initialMeta
  );
  const tokens = produceTokens({
    input,
    currentPosition,
    nextPosition,
    character,
    meta,
  });
  if (tokens.some(isDisallowedToken)) {
    const disallowedTokens = tokens.filter(isDisallowedToken);
    throwCollectedErrors(disallowedTokens);
  }
  return tokens;
}
