export interface List<T> {
  lookAt: (i: number) => T;
  get: () => T[];
  rm: () => T;
  head: () => T;
}

export function list<T>(_xs: T[]): List<T> {
  const xs = [..._xs];
  return {
    lookAt: (i: number) => xs[i],
    get: () => xs,
    rm: () => {
      const currentToken = xs.shift();
      return currentToken;
    },
    head: () => xs[0],
  };
}
