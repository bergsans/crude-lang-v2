import {
  NUL,
  EOF,
  IDENTIFIER,
  LET,
  INTEGER,
  UNALLOWED_CHARACTER,
  characterNames,
  BOOLEAN,
} from './token-types';
import { throwNoInput, throwCollectedErrors } from './token-errors';
import {
  isDigit,
  isASCIIAlphabetic,
  isUnallowedToken,
  isEqual,
  isNotEqual,
  isParens,
  isOr,
  isGreaterThan,
  isLowerThan,
  isGreaterThanOrEqual,
  isLowerThanOrEqual,
  isOperator,
  isSemicolon,
  isAssign,
  isAndSign,
  isOrSign,
} from '../utils/predicates';
import RESERVED_KEYWORD from './reserved-keywords';

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
}

export type Tokens = Token[];

interface Data {
  input: string;
  currentPosition?: number;
  nextPosition: number;
  character: string;
  meta: Metadata;
  currentToken?: Token;
}

function peekCharacter(input: string, nextPosition: number) {
  return nextPosition >= input.length ? NUL : input[nextPosition];
}

function getMetadata(input: string, meta: Metadata, nextPosition: number) {
  let { col, ln, realPosition } = meta;
  while (realPosition < nextPosition) {
    if (input[realPosition] === '\n') {
      ln++;
      col = 1;
    } else {
      col++;
    }
    realPosition++;
  }
  return {
    ln,
    col,
    realPosition,
  };
}

function readCharacter(
  input: string,
  nextPosition: number,
  prevMeta: Metadata
) {
  const meta = getMetadata(input, prevMeta, nextPosition);
  return {
    character: nextPosition >= input.length ? NUL : input[nextPosition],
    currentPosition: nextPosition,
    nextPosition: nextPosition + 1,
    meta,
  };
}

function newToken(type: string, literal: string, meta: Metadata): Token {
  return { type, literal, meta };
}

interface Output extends Partial<Data> {
  name?: string;
  number?: string;
}

function read(
  data: Data,
  readType: string,
  pred: (v: string) => boolean
): Output {
  let key: string = '';
  while (pred(data.character)) {
    key = ''.concat(key, data.character);
    const nextCharacter = readCharacter(
      data.input,
      data.nextPosition,
      data.meta
    );
    if (!pred(peekCharacter(data.input, data.nextPosition))) break;
    data.nextPosition = nextCharacter.nextPosition;
    data.character = nextCharacter.character;
    data.meta = nextCharacter.meta;
  }
  const { nextPosition, character, meta } = data;
  return { nextPosition, character, meta, [readType]: key };
}

function consumeWhitespace(
  input: string,
  currentPosition: number,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  while (
    character === ' ' ||
    character === '\r' ||
    character === '\n' ||
    character === '\t'
  ) {
    const nextCharacter = readCharacter(input, nextPosition, meta);
    character = nextCharacter.character;
    currentPosition = nextCharacter.currentPosition;
    nextPosition = nextCharacter.nextPosition;
    meta = nextCharacter.meta;
  }
  return { currentPosition, nextPosition, character, meta };
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
    _currentPosition,
    _nextPosition,
    _character,
    _meta
  );
  if (character === NUL) {
    currentToken = newToken(EOF, NUL, meta);
  } else if (
    isOr(
      [
        isNotEqual,
        isEqual,
        isAndSign,
        isOrSign,
        isGreaterThanOrEqual,
        isLowerThanOrEqual,
      ],
      character,
      peekCharacter(input, nextPosition)
    )
  ) {
    const sign = character + peekCharacter(input, nextPosition);
    currentToken = newToken(characterNames[sign], sign, meta);
    nextPosition++;
  } else if (
    isOr(
      [isGreaterThan, isLowerThan, isAssign, isParens, isOperator, isSemicolon],
      character
    )
  ) {
    currentToken = newToken(characterNames[character], character, meta);
  } else if (isASCIIAlphabetic(character)) {
    const nextToken = read(
      { input, nextPosition, character, meta },
      'name',
      isASCIIAlphabetic
    );
    nextPosition = nextToken.nextPosition;
    character = nextToken.character;
    if (nextToken.name === RESERVED_KEYWORD.LET) {
      currentToken = newToken(LET, nextToken.name, meta);
    } else if (nextToken.name === RESERVED_KEYWORD.TRUE) {
      currentToken = newToken(BOOLEAN, RESERVED_KEYWORD.TRUE, meta);
    } else if (nextToken.name === RESERVED_KEYWORD.FALSE) {
      currentToken = newToken(BOOLEAN, RESERVED_KEYWORD.FALSE, meta);
    } else if (typeof nextToken.name === 'string') {
      currentToken = newToken(IDENTIFIER, nextToken.name, meta);
    }
  } else if (isDigit(character)) {
    const nextToken = read(
      { input, nextPosition, character, meta },
      'number',
      isDigit
    );
    nextPosition = nextToken.nextPosition;
    character = nextToken.character;
    currentToken = newToken(INTEGER, nextToken.number, meta);
  } else {
    currentToken = newToken(UNALLOWED_CHARACTER, character, meta);
  }
  let nextCharacter = readCharacter(input, nextPosition, meta);
  character = nextCharacter.character;
  nextPosition = nextCharacter.nextPosition;
  meta = nextCharacter.meta;
  return {
    currentToken,
    nextPosition,
    character,
    meta,
  };
}

function getTokens(data: Data) {
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

export function tokenize(input: string): Tokens {
  const initialMeta: Metadata = {
    realPosition: 0,
    col: 1,
    ln: 1,
  };
  if (!input.length) {
    throwNoInput();
  }
  let { character, currentPosition, nextPosition, meta } = readCharacter(
    input,
    0,
    initialMeta
  );
  const tokens = getTokens({
    input,
    currentPosition,
    nextPosition,
    character,
    meta,
  });
  if (tokens.some(isUnallowedToken)) {
    const unallowedTokens = tokens.filter(isUnallowedToken);
    throwCollectedErrors(unallowedTokens);
  }
  return tokens;
}
