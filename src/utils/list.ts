export interface List<T> {
  get: () => T[];
  rm: () => T;
  head: () => T;
}

export function list<T>(_xs: T[]): List<T> {
  const xs = [..._xs];
  return {
    get: () => xs,
    rm: () => {
      const currentToken = xs.shift();
      return currentToken;
    },
    head: () => xs[0],
  };
}
