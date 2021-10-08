#!/usr/bin/env node

import { createInterface } from 'readline';

import methods from '../index';
import { list } from '../utils/list';
const { interpret, tokenize, parse, environment, evaluate } = methods;
const repl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getHelpTexts() {
  const msg = `
 ----------------------------------------------------------------------------------
  _______  ______    __   __  ______   _______  ___      _______  __    _  _______ 
 |       ||    _ |  |  | |  ||      | |       ||   |    |   _   ||  |  | ||       |
 |       ||   | ||  |  | |  ||  _    ||    ___||   |    |  |_|  ||   |_| ||    ___|
 |       ||   |_||_ |  |_|  || | |   ||   |___ |   |    |       ||       ||   | __ 
 |      _||    __  ||       || |_|   ||    ___||   |___ |       ||  _    ||   ||  |
 |     |_ |   |  | ||       ||       ||   |___ |       ||   _   || | |   ||   |_| |
 |_______||___|  |_||_______||______| |_______||_______||__| |__||_|  |__||_______|

 READ-EVALUATE-PRINT-LOOP

 ----------------------------------------------------------------------------------
`;

  const helpMsg = `
 ----------------------------------------------------------------------------------
   Exit\t\t :exit
   Help\t\t :help
 ----------------------------------------------------------------------------------
`;
  return { msg, helpMsg };
}
const { helpMsg, msg } = getHelpTexts();

const commands = {
  ':exit': () => process.exit(0),
  ':help': () => console.log(helpMsg),
};

console.log(msg);

(function main() {
  repl.question('> ', (input) => {
    input in commands ? commands[input]() : handleUserInput(input);
    main();
  });
})();

const replContext = environment({});

function handleUserInput(inp: string) {
  try {
    const input = inp.endsWith(';') ? inp : `${inp};`;
    const tokens = tokenize(input);
    if ([1, 2].includes(tokens.length)) {
      if (tokens[0].type === 'IDENTIFIER') {
        console.log(replContext[tokens[0].literal]);
      } else {
        console.log(tokens[0].literal);
      }
      return;
    }
    const ast = parse(tokens);
    if (ast.body.length === 1 && ast.body[0].type === 'BinaryExpression') {
      const inputWithReturn = `return ${input}`;
      console.log(evaluate(parse(tokenize(inputWithReturn)), replContext));
    } else {
      console.log(interpret(input, replContext));
    }
  } catch (e) {
    console.log(e);
  }
}
