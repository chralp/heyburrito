import { default as log } from 'bog';
import http from 'http';
import BurritoStore from './store/BurritoStore';
import path from 'path';
import mergeUserData from './lib/mergeUserData';
import fs from 'fs';
import WebSocket from 'ws'

// Webserver port
const port: string = process.env.PORT || '3333';

export default ((publicPath: string, serverStoredSlackUsers: Function, ) => {
    const requestHandler = (request, response) => {
        log.info('request ', request.url);

        let filePath: string = publicPath + request.url;

        if (request.url == '/') {
            filePath += '/index.html';
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

    const server = http.createServer(requestHandler);

    server.listen(port, (err) => {
        if (err) {
            return console.log('something bad happened', err);
        }
        log.info(`Webserver started on ${port}`);
    });

    const wss: any = new WebSocket.Server({ port: 8080 });

    wss.broadcast = (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    BurritoStore.on('GIVE', (user) => {
        BurritoStore.getUserScore(user).then((result) => {
            const user = mergeUserData(serverStoredSlackUsers(), result);

            if (user.length) {
                wss.broadcast(JSON.stringify({ event: 'GIVE', data: user[0] }));
            }
        });
    });

    BurritoStore.on('TAKE_AWAY', (user) => {
        BurritoStore.getUserScore(user).then((result) => {
            const user = mergeUserData(serverStoredSlackUsers(), result);

            if (user.length) {
                wss.broadcast(JSON.stringify({ event: 'TAKE_AWAY', data: user[0] }));
            }
        });
    });

    wss.on('connection', function connection(ws: any) {
        ws.on('message', function incoming(message) {

            message = JSON.parse(message);
            if (message.event in messageHandlers) {
                messageHandlers[message.event](message.data);
            } else {
                log.warn("Function", message.event, "not found")
            }
        });

        const messageHandlers = {
            getReceivedList() {
                BurritoStore.getUserScore().then((users) => {
                    const result: Array<object> = mergeUserData(serverStoredSlackUsers(), users);
                    ws.send(JSON.stringify({ event: 'receivedList', data: result }));
                });
            },

            getUserStats(user: string) {
                BurritoStore.getGivers(user).then(users => mergeUserData(serverStoredSlackUsers(), users)).then((givers) => {
                    BurritoStore.getGiven(user).then(users => mergeUserData(serverStoredSlackUsers(), users)).then((gived) => {
                        BurritoStore.getUserScore(user).then((userScoreData) => {
                            const result: Array<object> = mergeUserData(serverStoredSlackUsers(), userScoreData);
                            ws.send(JSON.stringify({
                                event: 'userStats',
                                data: {
                                    user: result[0],
                                    gived,
                                    givers,
                                }
                            }));
                        });
                    });
                });
            },

            getGivenList() {
                BurritoStore.getUserScore().then((users) => {
                    const result = mergeUserData(serverStoredSlackUsers(), users.map((user) => {
                        return user;
                    }));
                    ws.send(JSON.stringify({ event: 'givenList', data: result }));
                });
            }
        }
    });

});
