import fs from 'fs';
import { fmtStr } from 'crude-dev-tools';

async function getFileContent(path: string) {
  try {
    const input = await fs.promises.readFile(path, 'utf-8');
    return input;
  } catch (e) {
    throw new Error(fmtStr(e, 'red'));
  }
}
export default getFileContent;
