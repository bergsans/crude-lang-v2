import { expect } from 'chai';
import { Token, tokenize } from '../src/lexer/tokenize';
import {
  parse,
  parseIfStatement,
  parseLetStatement,
  parseLiteralExpression,
  _parseBinaryExpression,
} from '../src/parser/parse';
import { list, List } from '../src/utils/list';

describe('Parser', () => {
  describe('IfStatement', () => {
    it('if(3 > 4) { 1; }', () => {
      const code = 'if(3 > 4) { 3 + 3; }';
      const tokens = tokenize(code);
      const li = list(tokens);
      const result = parseIfStatement(li);
      const expectedResult = {
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
              type: 'BinaryExpression',
              left: {
                value: {
                  type: 'INTEGER',
                  literal: '3',
                  meta: {
                    ln: 1,
                    col: 13,
                    realPosition: 12,
                  },
                },
              },
              value: {
                type: 'PLUS',
                literal: '+',
                meta: {
                  ln: 1,
                  col: 15,
                  realPosition: 14,
                },
              },
              right: {
                value: {
                  type: 'INTEGER',
                  literal: '3',
                  meta: {
                    ln: 1,
                    col: 17,
                    realPosition: 16,
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

      it('4 == 4;', () => {
        const code = 'let x = 4 == 4;';
        const tokens = tokenize(code).slice(1); // remove 'let'
        const li = list(tokens);
        const result = parseLetStatement(li);
        const expectedResult = {
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
        };
        expect(result).to.deep.equal(expectedResult);
      });
    });

    describe('LetDeclaration', () => {
      it('let x = 4;', () => {
        const code = 'let x = 4;';
        const tokens = tokenize(code).slice(1); // remove 'let'
        const li = list(tokens);
        const result = parseLetStatement(li);
        const expectedResult = {
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
        };
        expect(result).to.deep.equal(expectedResult);
      });

      it('let x = 4 + 4;', () => {
        const code = 'let x = 4 + 4;';
        const tokens = tokenize(code).slice(1); // remove 'let'
        const li = list(tokens);
        const result = parseLetStatement(li);
        const expectedResult = {
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
        };
        expect(result).to.deep.equal(expectedResult);
      });

      it('Full LetDeclaration single line', () => {
        const code = 'let x = 9;';
        const tokens = tokenize(code);
        const result = parse(tokens);
        const expectedResult = {
          type: 'Program',
          body: [
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
        };
        expect(result).to.deep.equal(expectedResult);
      });

      it('Full LetDeclaration multi line', () => {
        const code = `
let numOne = 100;
let numTwo = 200;
`;
        const tokens = tokenize(code);
        const ast = parse(tokens);
        expect(ast.body.length).to.eql(2);
        expect(ast.body[0].id.name).to.equal('numOne');
        expect(ast.body[0].statement.expression.literal).to.equal('100');
        expect(ast.body[1].id.name).to.equal('numTwo');
        expect(ast.body[1].statement.expression.literal).to.equal('200');
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
