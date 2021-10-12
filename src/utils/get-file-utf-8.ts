import fs from 'fs';

async function getFileContent(path: string) {
  try {
    const input = await fs.promises.readFile(path, 'utf-8');
    return input;
  } catch (e) {
    throw new Error(e);
  }
}
export default getFileContent;
