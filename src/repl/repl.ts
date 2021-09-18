#!/usr/bin/env node

import { createInterface } from 'readline';

import { evaluateBinaryExpression } from '../evaluate/evaluate';
import { _parseBinaryExpression } from '../parser/parse';
import { tokenize } from '../lexer/tokenize';
import { list } from '../utils/list';

const interpret = (inp: string) =>
  evaluateBinaryExpression(_parseBinaryExpression(list(tokenize(inp))));

const repl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getHelpTexts() {
  const msg = `
  --------------------------------------------------------------
   _______  ______    __   __  ______   _______  ___      _______  __    _  _______ 
  |       ||    _ |  |  | |  ||      | |       ||   |    |   _   ||  |  | ||       |
  |       ||   | ||  |  | |  ||  _    ||    ___||   |    |  |_|  ||   |_| ||    ___|
  |       ||   |_||_ |  |_|  || | |   ||   |___ |   |    |       ||       ||   | __ 
  |      _||    __  ||       || |_|   ||    ___||   |___ |       ||  _    ||   ||  |
  |     |_ |   |  | ||       ||       ||   |___ |       ||   _   || | |   ||   |_| |
  |_______||___|  |_||_______||______| |_______||_______||__| |__||_|  |__||_______|
 
  READ-EVALUATE-PRINT-LOOP

`;

  const helpMsg = `
--------------------------------------------------------------
--------------------------------------------------------------
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

function handleUserInput(inp: string) {
  try {
    const input = inp.endsWith(';') ? inp : inp + ';';
    console.log(interpret(input));
  } catch (e) {
    console.log(e);
  }
}