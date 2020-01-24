import * as log from 'bog';
import fs from 'fs';
import http from 'http';
import path from 'path';
import config from '../config';

// Defaults
const defaultUrlPath: string = config.http.web_path;
const publicPath: string = config.misc.theme;
const libPath: string = path.normalize('./www/lib/');

export default (request: http.IncomingMessage, response: http.ServerResponse) => {
    let urlReplaced: string = request.url.replace(defaultUrlPath, '');
    let filePath: string = publicPath + urlReplaced;

    if (!urlReplaced) urlReplaced = '/';

    if (urlReplaced === '/') filePath += 'index.html';

    const extname = String(path.extname(filePath)).toLowerCase();

    const mimeTypes: object = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.ico': 'image/x-icon',
        '.jpg': 'image/jpg',
    };

    const contentType: string = mimeTypes[extname] || 'application/octet-stream';


    if (contentType.startsWith('image')) {
        fs.readFile(filePath, (err, content) => {
            if (!err) {
                response.writeHead(200, { 'Content-type': contentType });
                response.end(content, 'utf-8');
            }
        });

    } else {
        fs.readFile(filePath, 'utf-8', (error: any, content: any) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    fs.readFile(`${publicPath}404.html`, (err: any, cont: any) => {
                        if (err) log.warn('No 404 page found');
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(cont, 'utf-8');
                    });
                } else {
                    response.writeHead(500);
                    response.end(`Sorry, check with the site admin for error: ${error.code}  ..\n`);
                    response.end();
                }
            } else {
                if (contentType === 'text/html') {
                    const js: string = fs.readFileSync(`${libPath}Hey.js`, 'utf-8');
                    content = content.replace('</head>', `<script>${js}</script></head>`);
                }
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }

};
