#!/usr/bin/env node

import methods from '../index';
import importStdLib from '../utils/import-std-lib';
import getFileContent from '../utils/get-file-utf-8';
const { tokenize, parse, evaluate } = methods;

const args = Array.from(process.argv).slice(2);

if (args.length !== 1) {
  throw new Error('must provide file');
}
const [path] = args;
interpretFile(path);

async function interpretFile(fileName: string) {
  try {
    const input = await getFileContent(fileName);
    try {
      const stdLib = await importStdLib();
      const tokens = tokenize(input);
      const parsed = parse(tokens, stdLib);
      console.log(evaluate(parsed));
    } catch (libError) {
      throw new Error(libError);
    }
  } catch (fileError) {
    throw new Error(fileError);
  }
}
