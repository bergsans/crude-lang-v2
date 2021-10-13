import { fmtStr } from 'crude-dev-tools';
import { Token } from './tokenize';

export class TokenizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenizeError';
  }
}

export function throwNoInput() {
  throw new TokenizeError(fmtStr('No input', 'red'));
}

function unallowedTokenMessage(unallowedToken: Token) {
  return `${unallowedToken.literal} - at line ${unallowedToken.meta.ln}, column ${unallowedToken.meta.col} - is an unvalid character.`;
}

export function throwCollectedErrors(unallowedTokens: Token[]) {
  const errorMessage = unallowedTokens.reduce(
    (acc, v) => acc.concat(unallowedTokenMessage(v), '\n'.repeat(2)),
    ''
  );
  throw new TokenizeError(fmtStr(errorMessage, 'red'));
}
