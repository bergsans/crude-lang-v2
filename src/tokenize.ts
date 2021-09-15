type TokenType = string;

type Literal = string;

interface Token {
  type: TokenType;
  literal: Literal;
}

type Tokens = Token[];

const NUL = '\0';

const EOF = 'EOF';
const LET = 'LET';
const IDENTIFIER = 'IDENTIFIER';
const INTEGER = 'INTEGER';
const ASSIGN = '=';
const SEMICOLON = ';';
const UNALLOWED_CHARACTER = 'UNALLOWED_CHARACTER';

class UnallowedCharacter extends Error {
  constructor(invalidToken: Token) {
    super(`${invalidToken.literal} is an unvalid character.`);
    this.name = 'UnallowedCharacter';
  }
}

function readCharacter(
  input: string,
  _currentPosition: number,
  nextPosition: number,
  character: string
) {
  if (nextPosition >= input.length) {
    character = NUL;
  }
  return {
    character: character === NUL ? NUL : input[nextPosition],
    currentPosition: nextPosition,
    nextPosition: nextPosition + 1,
    input,
  };
}

const newToken = (type: string, literal: string) => ({ type, literal });

const isASCIIAlphabetic = (character: string) => character.match(/[a-z]/i);

const isDigit = (character: string) => character.match(/[0-9]/);

function readNumber(
  input: string,
  currentPosition: number,
  nextPosition: number,
  character: string
) {
  let number = '';
  while (isDigit(character)) {
    number += character;
    const nextCharacter = readCharacter(
      input,
      currentPosition,
      nextPosition,
      character
    );
    currentPosition = nextCharacter.currentPosition;
    nextPosition = nextCharacter.nextPosition;
    character = nextCharacter.character;
  }
  return { input, currentPosition, nextPosition, character, number };
}

function readIdentifier(
  input: string,
  currentPosition: number,
  nextPosition: number,
  character: string
) {
  let name = '';
  while (isASCIIAlphabetic(character)) {
    name = ''.concat(name, character);
    const nextCharacter = readCharacter(
      input,
      currentPosition,
      nextPosition,
      character
    );
    currentPosition = nextCharacter.currentPosition;
    nextPosition = nextCharacter.nextPosition;
    character = nextCharacter.character;
  }
  return { input, currentPosition, nextPosition, character, name };
}

function consumeWhitespace(
  input: string,
  currentPosition: number,
  nextPosition: number,
  character: string
) {
  let nextCharacter;
  while (
    character === ' ' ||
    character === '\r' ||
    character === '\n' ||
    character === '\t'
  ) {
    nextCharacter = readCharacter(
      input,
      currentPosition,
      nextPosition,
      character[currentPosition]
    );
    character = nextCharacter.character;
  }
  if (!nextCharacter) {
    return { input, currentPosition, nextPosition, character };
  }
  currentPosition = nextCharacter.currentPosition;
  nextPosition = nextCharacter.nextPosition;
  character = nextCharacter.character;
  return { input, currentPosition, nextPosition, character };
}

function nextToken(
  _input: string,
  _currentPosition: number,
  _nextPosition: number,
  _character: string
) {
  let currentToken: Token | undefined;
  let { input, currentPosition, nextPosition, character } = consumeWhitespace(
    _input,
    _currentPosition,
    _nextPosition,
    _character
  );
  if (character === NUL) currentToken = newToken(EOF, NUL);
  else if (character === ASSIGN) {
    currentToken = newToken(ASSIGN, character);
  } else if (character === SEMICOLON)
    currentToken = newToken(SEMICOLON, character);
  else if (isASCIIAlphabetic(character)) {
    const nextToken = readIdentifier(
      input,
      currentPosition,
      nextPosition,
      character
    );
    currentPosition = nextToken.currentPosition;
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
    currentPosition = nextToken.currentPosition;
    nextPosition = nextToken.nextPosition;
    character = nextToken.character;
    currentToken = newToken(INTEGER, nextToken.number);
  } else {
    currentToken = newToken(UNALLOWED_CHARACTER, character);
  }
  return {
    currentToken,
    currentPosition,
    nextPosition,
    input,
    character,
  };
}

const isUnallowedCharacter = (token: Token) =>
  token.type === UNALLOWED_CHARACTER;

export function tokenize(inp: string): Tokens {
  if (!inp.length) {
    throw new Error('No input.');
  }
  let tokens = [];
  let currentPosition = 0;
  let nextPosition = 0;
  let input = inp;
  let character = input[0];
  while (character !== NUL) {
    let nextCharacter = readCharacter(
      input,
      currentPosition,
      nextPosition,
      character
    );
    character = nextCharacter.character;
    input = nextCharacter.input;
    currentPosition = nextCharacter.currentPosition;
    nextPosition = nextCharacter.nextPosition;
    let next = nextToken(input, currentPosition, nextPosition, character);
    //if ([IDENTIFIER, INTEGER, LET].includes(next.currentToken.type)) {
    character = next.character;
    input = next.input;
    currentPosition = next.currentPosition;
    nextPosition = next.nextPosition;
    //}
    tokens.push(next.currentToken);
  }
  if (tokens.some(isUnallowedCharacter)) {
    const unallowedCharacters = tokens.filter(isUnallowedCharacter);
    unallowedCharacters.forEach((unallowedCharacter) => {
      throw new UnallowedCharacter(unallowedCharacter);
    });
  }
  return tokens;
}
