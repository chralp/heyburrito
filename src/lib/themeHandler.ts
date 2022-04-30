import * as fs from 'fs';
import log from 'loglevel';
import { spawn } from 'child_process';
import config from '../config';

const THEMES_AVAILABLE: any = [];
let times = 0;

async function gitFunc(args, cwd: string) {
  const [option, url] = args;
  if (option === 'clone') log.info('Cloning theme:', url);
  if (option === 'pull') log.info('Pulling latest theme:', url);

  return new Promise((resolve, reject) => {
    const process = spawn('git', args, { cwd });
    process.on('close', (status: any) => {
      if (status === 0) {
        resolve(true);
      } else {
        reject(status);
      }
    });
  });
}

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

const recursive = async (args, cwd) => {
  times += 1;
  try {
    await gitFunc(args, cwd);
    return true;
  } catch (error) {
    if (times < 5) {
      await sleep();
      await recursive(args, cwd);
    } else {
      throw error;
    }
  }
  return true;
};

async function git(args, cwd: string = config.theme.root) {
  return recursive(args, cwd);
}

async function checkThemePath() {
  fs.readdirSync(config.theme.root).forEach((file: string) => {
    const isDir = fs.lstatSync(`${config.theme.root}${file}`).isDirectory();
    if (isDir) {
      THEMES_AVAILABLE.push({
        name: file,
        path: `${config.theme.root}${file}`,
      });
    }
  });
}

export default async () => {
  checkThemePath();

  const theme = config.theme.url;
  const [themeName] = theme.split('/').slice(-1);
  const [themeExists] = THEMES_AVAILABLE.filter((x) => x.name === themeName);

  if (config.theme.path) {
    log.info('Loading theme from disk');
    log.info('Theme:', config.theme.path);
  }

  if (!config.theme.path) {
    if (themeExists) {
      log.info('Theme exist on disk');
      log.info('Theme:', theme);
      if (config.theme.latest) {
        log.info('Get latest = true');
        try {
          await git(['pull'], themeExists.path);
          log.info('Latest theme pulled');
          return true;
        } catch (err) {
          log.warn('Could not pull latest, error code:', err);
        }
      }
    } else {
      log.info('Theme does not exist on disk');
      log.info('Theme:', theme);
      try {
        await git(['clone', theme]);
        log.info('Theme cloned');
        return true;
      } catch (err) {
        log.warn('Could not clone theme, error code:', err);
        log.warn('Theme:', theme);
        return true;
      }
    }
  }
  return true;
};
