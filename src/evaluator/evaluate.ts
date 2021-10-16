import { NIL } from '../lexer/token-types';
import { evaluateTypes } from './evaluate-built-in-types';

interface LexicalScope {
  [key: string]: any;
}

export interface Environment {
  scope: LexicalScope;
  parent: LexicalScope;
  get(key: string): any;
}

export function environment(
  scope: LexicalScope,
  parent?: LexicalScope
): Environment {
  return {
    scope,
    parent,
    get: (name: string) => {
      return name in scope
        ? scope[name]
        : parent !== undefined && parent.get(name);
    },
  };
}

export function evaluate(node, context = environment({})) {
  return node.type in evaluateTypes
    ? evaluateTypes[node.type](node, context)
    : NIL;
}
