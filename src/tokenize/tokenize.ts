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
import { throwNoInput, throwUnallowedCharacter } from './token-errors';
import { isDigit, isASCIIAlphabetic, isUnallowedCharacter } from './helpers';

export type TokenType = string;
export type Literal = string;
export interface Token {
  type: TokenType;
  literal: Literal;
}
export type Tokens = Token[];

function peekCharacter(input: string, nextPosition: number) {
  return nextPosition >= input.length ? NUL : input[nextPosition];
}

function readCharacter(input: string, nextPosition: number) {
  return {
    character: nextPosition >= input.length ? NUL : input[nextPosition],
    currentPosition: nextPosition,
    nextPosition: nextPosition + 1,
  };
}

function newToken(type: string, literal: string) {
  return { type, literal };
}

export function readNumber(
  input: string,
  currentPosition: number,
  nextPosition: number,
  character: string
) {
  let number = '';
  while (isDigit(character)) {
    number = ''.concat(number, character);
    const nextCharacter = readCharacter(input, nextPosition);
    if (!isDigit(peekCharacter(input, nextPosition))) break;
    currentPosition = nextCharacter.currentPosition;
    nextPosition = nextCharacter.nextPosition;
    character = nextCharacter.character;
  }
  return { currentPosition, nextPosition, character, number };
}

function readIdentifier(
  input: string,
  nextPosition: number,
  character: string
) {
  let name = '';
  while (isASCIIAlphabetic(character)) {
    name = ''.concat(name, character);
    const nextCharacter = readCharacter(input, nextPosition);
    if (!isASCIIAlphabetic(peekCharacter(input, nextPosition))) break;
    nextPosition = nextCharacter.nextPosition;
    character = nextCharacter.character;
  }
  return { nextPosition, character, name };
}

function consumeWhitespace(
  input: string,
  currentPosition: number,
  nextPosition: number,
  character: string
) {
  while (
    character === ' ' ||
    character === '\r' ||
    character === '\n' ||
    character === '\t'
  ) {
    const nextCharacter = readCharacter(input, nextPosition);
    character = nextCharacter.character;
    currentPosition = nextCharacter.currentPosition;
    nextPosition = nextCharacter.nextPosition;
  }
  return { currentPosition, nextPosition, character };
}

function nextToken(
  input: string,
  _currentPosition: number,
  _nextPosition: number,
  _character: string
) {
  let currentToken: Token | undefined;
  let { currentPosition, nextPosition, character } = consumeWhitespace(
    input,
    _currentPosition,
    _nextPosition,
    _character
  );
  if (character === NUL) currentToken = newToken(EOF, NUL);
  else if (character === ASSIGN) {
    currentToken = newToken(ASSIGN, character);
  } else if (character === SEMICOLON) {
    currentToken = newToken(SEMICOLON, character);
  } else if (character === L_PAREN) {
    currentToken = newToken(L_PAREN, character);
  } else if (character === R_PAREN) {
    currentToken = newToken(R_PAREN, character);
  } else if (isASCIIAlphabetic(character)) {
    const nextToken = readIdentifier(input, nextPosition, character);
    nextPosition = nextToken.nextPosition;
    character = nextToken.character;
    if (nextToken.name === 'let') {
      currentToken = newToken(LET, nextToken.name);
    } else {
      currentToken = newToken(IDENTIFIER, nextToken.name);
    }
  } else if (isDigit(character)) {
    const nextToken = readNumber(
      input,
      currentPosition,
      nextPosition,
      character
    );
    nextPosition = nextToken.nextPosition;
    character = nextToken.character;
    currentToken = newToken(INTEGER, nextToken.number);
  } else {
    currentToken = newToken(UNALLOWED_CHARACTER, character);
  }
  let nextCharacter = readCharacter(input, nextPosition);
  character = nextCharacter.character;
  currentPosition = nextCharacter.currentPosition;
  nextPosition = nextCharacter.nextPosition;
  return {
    currentToken,
    nextPosition,
    character,
  };
}

export function tokenize(input: string): Tokens {
  if (!input.length) {
    throwNoInput();
  }
  let tokens = [];
  let { character, currentPosition, nextPosition } = readCharacter(input, 0);
  while (character !== NUL) {
    let next = nextToken(input, currentPosition, nextPosition, character);
    tokens.push(next.currentToken);
    if ([IDENTIFIER, INTEGER, LET].includes(next.currentToken.type)) {
      character = next.character;
      nextPosition = next.nextPosition;
    }
    character = next.character;
    nextPosition = next.nextPosition;
  }
  if (tokens.some(isUnallowedCharacter)) {
    tokens.filter(isUnallowedCharacter).forEach(throwUnallowedCharacter);
  }
  return tokens;
}
