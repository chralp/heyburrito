import log from 'loglevel';
import path from 'path';
import fs from 'fs';

export const root: string = path.normalize(`${__dirname}/../../../`);
export const fixPath = (p: string): string => {
  if (!p.startsWith('/')) return `/${p}`;
  if (!p.endsWith('/')) return `${p}/`;
  return p;
};

export const pathExists = (inPath: string) => {
  try {
    log.debug('Checking if path exists', inPath);
    return fs.lstatSync(inPath).isDirectory();
  } catch (e) {
    return false;
  }
};

export const createPath = (inPath: string) => {
  try {
    log.debug(`Trying to create path ${inPath}`);
    fs.mkdirSync(inPath);
    const exists = pathExists(inPath);
    if (exists) return true;
    throw new Error('Neit');
  } catch (e) {
    log.debug(`Could not create path ${inPath}`);
    return false;
  }
};
