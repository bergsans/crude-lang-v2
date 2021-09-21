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
import {
  isDigit,
  isASCIIAlphabetic,
  isIdentifier,
  isReservedKeyword,
} from '../utils/predicates';
import { Data, NextToken, Metadata, Token, peekCharacter } from './tokenize';

export function readCharacter(
  input: string,
  nextPosition: number,
  prevMeta: Metadata
) {
  const meta = produceMetadata(input, prevMeta, nextPosition);
  return {
    character: nextPosition >= input.length ? NUL : input[nextPosition],
    currentPosition: nextPosition,
    nextPosition: nextPosition + 1,
    meta,
  };
}

function read(
  data: Data,
  readType: string,
  pred: (v: string) => boolean
): NextToken {
  let key: string = '';
  while (pred(data.character)) {
    key = ''.concat(key, data.character);
    const nextCharacter = readCharacter(
      data.input,
      data.nextPosition,
      data.meta
    );
    if (!pred(peekCharacter(data.input, data.nextPosition))) break;
    data = Object.assign(data, nextCharacter);
  }
  const { nextPosition, character, meta } = data;
  return { nextPosition, character, meta, [readType]: key };
}

function produceMetadata(input: string, meta: Metadata, nextPosition: number) {
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

export function produceNULToken(
  _input: string,
  nextPosition: number,
  _character: string,
  meta: Metadata
) {
  return {
    nextPosition: nextPosition,
    currentToken: newToken(EOF, NUL, meta),
  };
}

export function produceComparisionOperatorToken(
  input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  const combinedCurrAndNextChar =
    character + peekCharacter(input, nextPosition);
  const sign =
    !['<', '>'].includes(character) ||
    ['<=', '>='].includes(combinedCurrAndNextChar)
      ? combinedCurrAndNextChar
      : character;
  return {
    currentToken: newToken(characterNames[sign], sign, meta),
    nextPosition: nextPosition + 1,
  };
}

export function newToken(type: string, literal: string, meta: Metadata): Token {
  return { type, literal, meta };
}

export function produceIdentifier(
  input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  const nextToken = read(
    { input, nextPosition, character, meta },
    'name',
    isASCIIAlphabetic
  );
  nextPosition = nextToken.nextPosition;
  character = nextToken.character;
  if (isReservedKeyword(nextToken)) {
    return {
      nextPosition,
      currentToken: newToken(
        nextToken.name === 'let' ? LET : BOOLEAN,
        nextToken.name,
        meta
      ),
    };
  } else if (isIdentifier(nextToken)) {
    return {
      nextPosition,
      currentToken: newToken(IDENTIFIER, nextToken.name, meta),
    };
  }
}

export function produceSingleSign(
  _input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  return {
    nextPosition,
    currentToken: newToken(characterNames[character], character, meta),
  };
}

export function produceUnallowedCharacter(
  _input: string,
  _nextPosition: number,
  character: string,
  meta: Metadata
) {
  return {
    nextPosition: _nextPosition,
    currentToken: newToken(UNALLOWED_CHARACTER, character, meta),
  };
}

export function produceNumber(
  input: string,
  nextPosition: number,
  character: string,
  meta: Metadata
) {
  const nextToken = read(
    { input, nextPosition, character, meta },
    'number',
    isDigit
  );
  return {
    currentToken: newToken(INTEGER, nextToken.number, meta),
    nextPosition: nextToken.nextPosition,
  };
}
