import log from 'bog';
import fs from 'fs';
import http from 'http';
import path from 'path';


import config from '../config';

const defaultUrlPath: string = config('WEB_PATH');
const publicPath: string = config("THEME")


export default (request: http.IncomingMessage, response: http.ServerResponse) => {

    let urlReplaced: string = request.url.replace(defaultUrlPath, '');
    let filePath: string = publicPath + urlReplaced;

    if (!urlReplaced) {
        urlReplaced = '/';
    }
    if (urlReplaced == '/') {
        filePath += 'index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();

    const mimeTypes: object = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
    };

    const contentType: string = mimeTypes[extname] || 'application/octet-stream';
    fs.readFile(filePath, 'utf-8', function(error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        } else {
            if (contentType === 'text/html') {
                const www: string = path.normalize(`${publicPath}/../../lib/`);
                const js: string = fs.readFileSync(`${www}Hey.js`, 'utf-8');
                content = content.replace('</head>', `<script>${js}</script></head>`);
            }

            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
};
