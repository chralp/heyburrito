import * as fs from 'fs';
import * as log from 'bog';
import { spawn } from 'child_process';
import config from '../config';

const THEMES_AVAILABLE: any = [];

async function gitFunc(args, cwd: string) {
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

async function git(args, cwd: string = config.theme.root) {
    let times = 0;

    const recursive = async () => {
        times += 1;
        try {
            await gitFunc(args, cwd);
            return true;
        } catch (error) {
            if (times < 5) {
                await sleep();
                await recursive();
            } else {
                throw error;
            }
        }
    };
    return recursive();
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
    } else {
        if (themeExists) {
            log.info('Theme exist on disk');
            log.info('Theme:', theme);
            if (config.theme.latest) {
                log.info('Get latest = true');
                try {
                    await git(['pull'], themeExists.path);
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
                return true;
            } catch (err) {
                log.warn('Could not clone theme, error code:', err);
                log.warn('Theme:', theme);
                return true;
            }
        }
    }
};