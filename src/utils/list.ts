export interface List<T> {
  isHead: (s: string) => boolean;
  lookAt: (i: number) => T;
  get: () => T[];
  next: () => T;
  head: () => T;
}

export function list<T extends { type: string }>(_xs: T[]): List<T> {
  const xs = [..._xs];
  return {
    isHead: (type: string) => xs[0].type === type,
    lookAt: (i: number) => xs[i],
    get: () => xs,
    next: () => {
      const currentToken = xs.shift();
      return currentToken;
    },
    head: () => xs[0],
  };
}
