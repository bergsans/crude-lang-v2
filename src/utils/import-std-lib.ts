import path from 'path';
import { tokenize } from '../lexer/tokenize';
import { parseBlockStatement } from '../parser/parse';
import { list } from './list';
import { fmtStr } from 'crude-dev-tools';
import getFileContent from './get-file-utf-8';

const STD_LIB_PATH = path.join(__dirname, '../', 'std-lib', 'lib.cr');

async function importStdLib(path = STD_LIB_PATH) {
  try {
    const rawContent = await getFileContent(path);
    const tokens = tokenize(rawContent);
    const formatTokens = list(tokens);
    const stdLib = parseBlockStatement(formatTokens);
    return stdLib;
  } catch (_e) {
    throw new Error(
      fmtStr(
        `Could not import standard library from path ${STD_LIB_PATH}`,
        'red'
      )
    );
  }
}
export default importStdLib;
