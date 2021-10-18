#!/usr/bin/env node

import { fmtStr } from 'crude-dev-tools';
import methods from '../index';
import importStdLib from '../utils/import-std-lib';
import getFileContent from '../utils/get-file-utf-8';
const { tokenize, parse, evaluate } = methods;

const args = Array.from(process.argv).slice(2);

if (args.length !== 1) {
  throw new Error(fmtStr('Must provide file.', 'red'));
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
      evaluate(parsed);
    } catch (libError) {
      throw new Error(fmtStr(libError, 'red'));
    }
  } catch (fileError) {
    throw new Error(fmtStr(fileError, 'red'));
  }
}
