import {
  NUL,
  EOF,
  IDENTIFIER,
  LET,
  INTEGER,
  L_PAREN,
  R_PAREN,
  ASSIGN,
  SEMICOLON,
  UNALLOWED_CHARACTER,
} from './token-types';
import { throwNoInput, throwCollectedErrors } from './token-errors';
import { isDigit, isASCIIAlphabetic, isUnallowedToken } from './helpers';

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

function peekCharacter(input: string, nextPosition: number) {
  return nextPosition >= input.length ? NUL : input[nextPosition];
}

function getMetadata(input: string, meta: Metadata, nextPosition: number) {
  let { col, ln, realPosition } = meta;

  // input.split('').forEach((ch, i) => console.log(`${ch} - ${i}`));
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

export function readNumber(
  input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  let number = '';
  while (isDigit(character)) {
    number = ''.concat(number, character);
    const nextCharacter = readCharacter(input, nextPosition, meta);
    if (!isDigit(peekCharacter(input, nextPosition))) break;
    nextPosition = nextCharacter.nextPosition;
    character = nextCharacter.character;
    meta = nextCharacter.meta;
  }
  return { nextPosition, character, number, meta };
}

function readIdentifier(
  input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  let name = '';
  while (isASCIIAlphabetic(character)) {
    name = ''.concat(name, character);
    const nextCharacter = readCharacter(input, nextPosition, meta);
    if (!isASCIIAlphabetic(peekCharacter(input, nextPosition))) break;
    nextPosition = nextCharacter.nextPosition;
    character = nextCharacter.character;
    meta = nextCharacter.meta;
  }
  return { nextPosition, character, name, meta };
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
  if (character === NUL) currentToken = newToken(EOF, NUL, meta);
  else if (character === ASSIGN) {
    currentToken = newToken(ASSIGN, character, meta);
  } else if (character === SEMICOLON) {
    currentToken = newToken(SEMICOLON, character, meta);
  } else if (character === L_PAREN) {
    currentToken = newToken(L_PAREN, character, meta);
  } else if (character === R_PAREN) {
    currentToken = newToken(R_PAREN, character, meta);
  } else if (isASCIIAlphabetic(character)) {
    const nextToken = readIdentifier(input, nextPosition, character, meta);
    nextPosition = nextToken.nextPosition;
    character = nextToken.character;
    if (nextToken.name === 'let') {
      currentToken = newToken(LET, nextToken.name, meta);
    } else {
      currentToken = newToken(IDENTIFIER, nextToken.name, meta);
    }
  } else if (isDigit(character)) {
    const nextToken = readNumber(input, nextPosition, character, meta);
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

function getTokens(
  input: string,
  currentPosition: number,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  const tokens = [];
  while (character !== NUL) {
    let next = nextToken(input, currentPosition, nextPosition, character, meta);
    character = next.character;
    nextPosition = next.nextPosition;
    meta = next.meta;
    tokens.push(next.currentToken);
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
  const tokens = getTokens(
    input,
    currentPosition,
    nextPosition,
    character,
    meta
  );
  if (tokens.some(isUnallowedToken)) {
    const unallowedTokens = tokens.filter(isUnallowedToken);
    throwCollectedErrors(unallowedTokens);
  }
  return tokens;
}
