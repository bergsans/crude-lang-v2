import { expect } from 'chai';
import { Token, tokenize } from '../src/lexer/tokenize';
import { parseLiteralExpression } from '../src/parser/parse-literal-expression';
import { parse } from '../src/parser/parse';
import { _parseBinaryExpression } from '../src/parser/parse-binary-expression';
import { list, List } from '../src/utils/list';

describe('Parser', () => {
  it('Parse nothing', () => {
    const code = '';
    const tokens = tokenize(code);
    const parsed = parse(tokens);
    const expectedResult = {
      type: 'Program',
      body: {
        type: 'BlockStatement',
        statements: [],
      },
    };
    expect(parsed).to.deep.equal(expectedResult);
  });

  it('Parse array', () => {
    const code = 'let nums = [1, 2];';
    const tokens = tokenize(code);
    const parsed = parse(tokens);
    const expectedResult = {
      type: 'Program',
      body: {
        type: 'BlockStatement',
        statements: [
          {
            type: 'LetDeclaration',
            id: {
              type: 'IDENTIFIER',
              name: 'nums',
            },
            statement: {
              type: 'ARRAY',
              elements: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'INTEGER',
                    literal: '1',
                    meta: {
                      ln: 1,
                      col: 13,
                      realPosition: 12,
                    },
                  },
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'INTEGER',
                    literal: '2',
                    meta: {
                      ln: 1,
                      col: 16,
                      realPosition: 15,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };
    expect(parsed).to.deep.equal(expectedResult);
  });

  it('Parse string', () => {
    const code = 'let name = "Gandalf the White";';
    const tokens = tokenize(code);
    const parsed = parse(tokens);
    const expectedResult = {
      type: 'Program',
      body: {
        type: 'BlockStatement',
        statements: [
          {
            type: 'LetDeclaration',
            id: {
              type: 'IDENTIFIER',
              name: 'name',
            },
            statement: {
              type: 'ExpressionStatement',
              expression: {
                type: 'STRING',
                literal: 'Gandalf the White',
                meta: {
                  ln: 1,
                  col: 12,
                  realPosition: 11,
                },
              },
            },
          },
        ],
      },
    };

    expect(parsed).to.deep.equal(expectedResult);
  });

  it('Parse call-expression', () => {
    const code = 'add(3, 3);';
    const tokens = tokenize(code);
    const parsed = parse(tokens);
    const expectedResult = {
      type: 'Program',
      body: {
        type: 'BlockStatement',
        statements: [
          {
            type: 'CallExpression',
            name: 'add',
            args: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'INTEGER',
                  literal: '3',
                  meta: {
                    ln: 1,
                    col: 5,
                    realPosition: 4,
                  },
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'INTEGER',
                  literal: '3',
                  meta: {
                    ln: 1,
                    col: 8,
                    realPosition: 7,
                  },
                },
              },
            ],
          },
        ],
      },
    };
    expect(parsed).to.deep.equal(expectedResult);
  });

  it('Parse let declaration and assignment', () => {
    const code = 'let x = 3;';
    const tokens = tokenize(code);
    const parsed = parse(tokens);
    const expectedResult = {
      type: 'Program',
      body: {
        type: 'BlockStatement',
        statements: [
          {
            type: 'LetDeclaration',
            id: {
              type: 'IDENTIFIER',
              name: 'x',
            },
            statement: {
              type: 'ExpressionStatement',
              expression: {
                type: 'INTEGER',
                literal: '3',
                meta: {
                  ln: 1,
                  col: 9,
                  realPosition: 8,
                },
              },
            },
          },
        ],
      },
    };
    expect(parsed).to.deep.equal(expectedResult);
  });

  describe('DefinitionStatement', () => {
    it('define add(a, b) { return a + b; }', () => {
      const code = 'define add(a, b) { return a + b; }';
      const tokens = tokenize(code);
      const result = parse(tokens);
      const expectedResult = {
        type: 'Program',
        body: {
          type: 'BlockStatement',
          statements: [
            {
              type: 'DefinitionStatement',
              name: 'add',
              params: [
                {
                  type: 'IDENTIFIER',
                  literal: 'a',
                  meta: {
                    ln: 1,
                    col: 12,
                    realPosition: 11,
                  },
                },
                {
                  type: 'IDENTIFIER',
                  literal: 'b',
                  meta: {
                    ln: 1,
                    col: 15,
                    realPosition: 14,
                  },
                },
              ],
              body: {
                type: 'BlockStatement',
                statements: [
                  {
                    type: 'ReturnStatement',
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        value: {
                          type: 'IDENTIFIER',
                          literal: 'a',
                          meta: {
                            ln: 1,
                            col: 27,
                            realPosition: 26,
                          },
                        },
                      },
                      value: {
                        type: 'PLUS',
                        literal: '+',
                        meta: {
                          ln: 1,
                          col: 29,
                          realPosition: 28,
                        },
                      },
                      right: {
                        value: {
                          type: 'IDENTIFIER',
                          literal: 'b',
                          meta: {
                            ln: 1,
                            col: 31,
                            realPosition: 30,
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      };
      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('IfStatement', () => {
    it('if(3 > 4) { return 1; }', () => {
      const code = 'if(3 > 4) { return 1; }';
      const tokens = tokenize(code);
      const result = parse(tokens);
      const expectedResult = {
        type: 'Program',
        body: {
          type: 'BlockStatement',
          statements: [
            {
              type: 'IfStatement',
              condition: {
                type: 'BinaryExpression',
                left: {
                  value: {
                    type: 'INTEGER',
                    literal: '3',
                    meta: {
                      ln: 1,
                      col: 4,
                      realPosition: 3,
                    },
                  },
                },
                value: {
                  type: 'GREATER_THAN',
                  literal: '>',
                  meta: {
                    ln: 1,
                    col: 6,
                    realPosition: 5,
                  },
                },
                right: {
                  value: {
                    type: 'INTEGER',
                    literal: '4',
                    meta: {
                      ln: 1,
                      col: 8,
                      realPosition: 7,
                    },
                  },
                },
              },
              consequence: {
                type: 'BlockStatement',
                statements: [
                  {
                    type: 'ReturnStatement',
                    value: {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'INTEGER',
                        literal: '1',
                        meta: {
                          ln: 1,
                          col: 20,
                          realPosition: 19,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      };
      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('ExpressionStatement', () => {
    describe('Integer', () => {
      it('4;', () => {
        const result = parseLiteralExpression({
          type: 'INTEGER',
          literal: '4',
        } as Token);
        const expectedResult = {
          type: 'ExpressionStatement',
          expression: {
            type: 'INTEGER',
            literal: '4',
          },
        };
        expect(result).to.deep.equal(expectedResult);
      });
    });

    describe('Boolean', () => {
      it('true;', () => {
        const code = 'true';
        const tokens = tokenize(code);
        const li = list(tokens);
        const result = parseLiteralExpression(li.head());
        const expectedResult = {
          type: 'ExpressionStatement',
          expression: {
            type: 'BOOLEAN',
            literal: 'true',
            meta: { ln: 1, col: 1, realPosition: 0 },
          },
        };
        expect(result).to.deep.equal(expectedResult);
      });

      it('let x = 4 == 4;', () => {
        const code = 'let x = 4 == 4;';
        const tokens = tokenize(code);
        const result = parse(tokens);
        const expectedResult = {
          type: 'Program',
          body: {
            type: 'BlockStatement',
            statements: [
              {
                type: 'LetDeclaration',
                id: {
                  type: 'IDENTIFIER',
                  name: 'x',
                },
                statement: {
                  type: 'BinaryExpression',
                  left: {
                    value: {
                      type: 'INTEGER',
                      literal: '4',
                      meta: {
                        ln: 1,
                        col: 9,
                        realPosition: 8,
                      },
                    },
                  },
                  value: {
                    type: 'EQUAL',
                    literal: '==',
                    meta: {
                      ln: 1,
                      col: 11,
                      realPosition: 10,
                    },
                  },
                  right: {
                    value: {
                      type: 'INTEGER',
                      literal: '4',
                      meta: {
                        ln: 1,
                        col: 14,
                        realPosition: 13,
                      },
                    },
                  },
                },
              },
            ],
          },
        };
        expect(result).to.deep.equal(expectedResult);
      });
    });

    describe('LetDeclaration', () => {
      it('let x = 4;', () => {
        const code = 'let x = 4;';
        const tokens = tokenize(code);
        const result = parse(tokens);
        const expectedResult = {
          type: 'Program',
          body: {
            type: 'BlockStatement',
            statements: [
              {
                type: 'LetDeclaration',
                id: {
                  type: 'IDENTIFIER',
                  name: 'x',
                },
                statement: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'INTEGER',
                    literal: '4',
                    meta: {
                      ln: 1,
                      col: 9,
                      realPosition: 8,
                    },
                  },
                },
              },
            ],
          },
        };
        expect(result).to.deep.equal(expectedResult);
      });

      it('let x = 4 + 4;', () => {
        const code = 'let x = 4 + 4;';
        const tokens = tokenize(code);
        const result = parse(tokens);
        const expectedResult = {
          type: 'Program',
          body: {
            type: 'BlockStatement',
            statements: [
              {
                type: 'LetDeclaration',
                id: {
                  type: 'IDENTIFIER',
                  name: 'x',
                },
                statement: {
                  type: 'BinaryExpression',
                  left: {
                    value: {
                      type: 'INTEGER',
                      literal: '4',
                      meta: {
                        ln: 1,
                        col: 9,
                        realPosition: 8,
                      },
                    },
                  },
                  value: {
                    type: 'PLUS',
                    literal: '+',
                    meta: {
                      ln: 1,
                      col: 11,
                      realPosition: 10,
                    },
                  },
                  right: {
                    value: {
                      type: 'INTEGER',
                      literal: '4',
                      meta: {
                        ln: 1,
                        col: 13,
                        realPosition: 12,
                      },
                    },
                  },
                },
              },
            ],
          },
        };
        expect(result).to.deep.equal(expectedResult);
      });

      it('Full LetDeclaration single line', () => {
        const code = 'let x = 9;';
        const tokens = tokenize(code);
        const result = parse(tokens);
        const expectedResult = {
          type: 'Program',
          body: {
            type: 'BlockStatement',
            statements: [
              {
                type: 'LetDeclaration',
                id: {
                  type: 'IDENTIFIER',
                  name: 'x',
                },
                statement: {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'INTEGER',
                    literal: '9',
                    meta: {
                      ln: 1,
                      col: 9,
                      realPosition: 8,
                    },
                  },
                },
              },
            ],
          },
        };
        expect(result).to.deep.equal(expectedResult);
      });

      it('Full LetDeclaration multi line', () => {
        const code = `
let numOne = 100;
let numTwo = 200;
`;
        const tokens = tokenize(code);
        const result = parse(tokens);
        expect(result.body.statements.length).to.eql(2);
        expect(result.body.statements[0].id.name).to.equal('numOne');
        expect(result.body.statements[0].statement.expression.literal).to.equal(
          '100'
        );
        expect(result.body.statements[1].id.name).to.equal('numTwo');
        expect(result.body.statements[1].statement.expression.literal).to.equal(
          '200'
        );
      });
    });

    describe('BinaryExpression', () => {
      it('4 + 4;', () => {
        const code = '4 + 4;';
        const expectedResult = {
          type: 'BinaryExpression',
          left: {
            value: {
              type: 'INTEGER',
              literal: '4',
            },
          },
          value: {
            type: 'PLUS',
            literal: '+',
          },
          right: {
            value: {
              type: 'INTEGER',
              literal: '4',
            },
          },
        };
        const tokens = tokenize(code).map(
          ({ type, literal }: Partial<Token>) => ({
            type,
            literal,
          })
        );
        const li = list(tokens);
        const result = _parseBinaryExpression(li as List<Token>);
        expect(result).to.deep.equal(expectedResult);
      });

      it('4 + 4 * 4', () => {
        const code = '4 + 4 * 4;';
        const expectedResult = {
          type: 'BinaryExpression',
          left: {
            value: {
              type: 'INTEGER',
              literal: '4',
              meta: {
                ln: 1,
                col: 1,
                realPosition: 0,
              },
            },
          },
          value: {
            type: 'PLUS',
            literal: '+',
            meta: {
              ln: 1,
              col: 3,
              realPosition: 2,
            },
          },
          right: {
            left: {
              value: {
                type: 'INTEGER',
                literal: '4',
                meta: {
                  ln: 1,
                  col: 5,
                  realPosition: 4,
                },
              },
            },
            value: {
              type: 'MULTIPLICATION',
              literal: '*',
              meta: {
                ln: 1,
                col: 7,
                realPosition: 6,
              },
            },
            right: {
              value: {
                type: 'INTEGER',
                literal: '4',
                meta: {
                  ln: 1,
                  col: 9,
                  realPosition: 8,
                },
              },
            },
          },
        };
        const tokens = tokenize(code);
        const li = list(tokens);
        const result = _parseBinaryExpression(li as List<Token>);
        expect(result).to.deep.equal(expectedResult);
      });
    });
  });
});
