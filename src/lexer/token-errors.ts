import { fmtStr } from 'crude-dev-tools';
import { Token } from './tokenize';

export class TokenizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenizeError';
  }
}

function disallowedTokenMessage(disallowedToken: Token) {
  return `${disallowedToken.literal} - at line ${disallowedToken.meta.ln}, column ${disallowedToken.meta.col} - is an invalid character.`;
}

export function throwCollectedErrors(disallowedTokens: Token[]) {
  const errorMessage = disallowedTokens.reduce(
    (acc, v) => acc.concat(disallowedTokenMessage(v), '\n'.repeat(2)),
    ''
  );
  throw new TokenizeError(fmtStr(errorMessage, 'red'));
}
