#!/usr/bin/env node

import { createInterface } from 'readline';
import { fmtStr } from 'crude-dev-tools';
import methods from '../index';
import importStdLib from '../utils/import-std-lib';
const { tokenize, parse, evaluate } = methods;
const repl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const msg = `
 ----------------------------------------------------------------------------------
  _______  ______    __   __  ______   _______  ___      _______  __    _  _______ 
 |       ||    _ |  |  | |  ||      | |       ||   |    |   _   ||  |  | ||       |
 |       ||   | ||  |  | |  ||  _    ||    ___||   |    |  |_|  ||   |_| ||    ___|
 |       ||   |_||_ |  |_|  || | |   ||   |___ |   |    |       ||       ||   | __ 
 |      _||    __  ||       || |_|   ||    ___||   |___ |       ||  _    ||   ||  |
 |     |_ |   |  | ||       ||       ||   |___ |       ||   _   || | |   ||   |_| |
 |_______||___|  |_||_______||______| |_______||_______||__| |__||_|  |__||_______|

 READ-EVALUATE-PRINT-LOOP`;

const helpMsg = `
 ----------------------------------------------------------------------------------
   Exit\t\t :exit
   Help\t\t :help
 ----------------------------------------------------------------------------------
`;

const examples = `
> 3 + 3;
6
> 2 + 2 == 5;
false
> "Hello, " + "World!";
Hello, World!
> let name = "Tux";
undefined
> name;
Tux
> map(inc, [1, 2, 3]);
[ 2, 3, 4 ]
> foldl(add, 0, [1, 2, 3, 4, 5]);
15
> filter(isOdd, [1, 2, 3, 4, 5]);
[ 1, 3, 5 ]
> define appendBang(str) { return str + "!"; }
undefined
> appendBang("Hi");
Hi!
`;

let replContext = [];

const commands = {
  ':exit': () => process.exit(0),
  ':help': () => console.log(examples),
};

console.log(fmtStr(msg, 'blue', null, 'bold'));
console.log(fmtStr(helpMsg, 'blue', null, 'bold'));

(async function initWithStdLib() {
  const stdLib = await importStdLib();
  main(stdLib);
})();

function main(stdLib) {
  repl.question('> ', (input) => {
    input in commands ? commands[input]() : handleUserInput(input, stdLib);
    main(stdLib);
  });
}

function handleUserInput(inp: string, stdLib) {
  try {
    const input = [...replContext, inp].join('\n');
    const result = evaluate(parse(tokenize(input), stdLib));
    if (['let', 'define'].some((expr) => inp.includes(expr))) {
      replContext.push(inp);
    }
    console.log(fmtStr(result, 'green'));
  } catch (e) {
    console.log(
      fmtStr(`I'm afraid I can't do that, dear it-is-always-the-user.`, 'red')
    );
  }
}
