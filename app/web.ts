import { default as log } from 'bog';
import http from 'http';
import BurritoStore from './store/BurritoStore';
import path from 'path';
import mergeUserData from './lib/mergeUserData';
import fs from 'fs';
import ScoreInterface from './types/Score.interface';
import { default as WebSocket } from 'ws';

// Webserver port
const port:string = process.env.PORT || '3333';

export default ((
    publicPath,
    serverStoredSlackUsers,
) => {
    const requestHandler = (request, response) => {
        log.info('request ', request.url);

        let filePath:string = publicPath + request.url;

        if (request.url == '/') {
            filePath += '/index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes:object = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
        };

        const contentType:string = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, 'utf-8', function (error, content) {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./404.html', function (error, content) {
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
                    const www:string = path.normalize(`${publicPath}/../../lib/`);
                    const js:string = fs.readFileSync(`${www}Hey.js`, 'utf-8');

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
        console.log(`server is listening on ${port}`);
    });

    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', function connection(ws:any) {
        console.log('NY CONNECTION ?');
        ws.on('message', function incoming(message) {
            console.log('message', JSON.parse(message));
            message = JSON.parse(message);
            switch (message.event){
            case 'getReceivedList':
                getReceivedList();
                break;
            case 'getUserStats':
                getUserStats(message.data);
                break;
            case 'getGivenList':
                getGivenList();
                break;
            }
        });

        function getReceivedList() {
            console.log('getReceivedList');
            BurritoStore.getUserScore().then((users) => {
                console.log('users', users);
                const result:Array<object> = mergeUserData(serverStoredSlackUsers(), users);
                ws.send(JSON.stringify({ event:'receivedList', data:result }));
            });
        }

        function getUserStats(user) {
            BurritoStore.getGivers(user)
                .then(users => mergeUserData(serverStoredSlackUsers(), users))
                .then((givers) => {
                    BurritoStore.getGiven(user).then((gived) => {
                        BurritoStore.getUserScore(user).then((userScoreData) => {
                            const result:Array<object> = mergeUserData(serverStoredSlackUsers(), userScoreData);
                            console.log('result', result);
                            const obj:object = {
                                user: result[0],
                                gived,
                                givers,
                            };
                            console.log(obj);
                            ws.send(JSON.stringify({ event:'userStats', data:obj }));
                        });
                    });
                });
        }

        function getGivenList() {
            BurritoStore.getUserScore().then((users) => {
                const result = mergeUserData(serverStoredSlackUsers(), users.map((user) => {
                    return user;
                }));
                ws.send(JSON.stringify({ event:'givenList', data:result }));
            });
        }

        BurritoStore.on('GIVE', (user) => {
            console.log('BURRE FÖRSTA', user);
            BurritoStore.getUserScore(user).then((result) => {
                const user = mergeUserData(serverStoredSlackUsers(), result);
                console.log('BURRE GG ANDRA', user);
                ws.send(JSON.stringify({ event:'GIVE', data:user }));
            });
        });

        BurritoStore.on('TAKE_AWAY', (user) => {
            BurritoStore.getUserScore(user).then((result) => {
                const user = mergeUserData(serverStoredSlackUsers(), result);
                console.log('BURRE ON user', user);
                ws.send(JSON.stringify({ event:'TAKE_AWAY', data:user }));
            });
        });
    });

});
