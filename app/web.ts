
import log from 'bog'
import http from "http"
import BurritoStore from './store/burrito'
import path from 'path'
import mergeData from './lib/mergeSlackRedis'

import fs from 'fs'

// Webserver port
const port = process.env.PORT || 3333;

export default ((
    publicPath,
    serverStoredSlackUsers,
) => {

    const requestHandler = (request, response) => {
        console.log('request ', request.url);

        var filePath = publicPath + request.url;
        if (filePath == './') {
            filePath = './index.html';
        }

        var extname = String(path.extname(filePath)).toLowerCase();
        var mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg'
        };

        var contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end();
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
      }

    const server = http.createServer(requestHandler)


    server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
    })

    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log("message",JSON.parse(message))
            message = JSON.parse(message)
            switch(message.event){
                case "getReceivedList":
                    getReceivedList()
                    break;
                case "getUserStats":
                    getUserStats(message.data)
                    break;
                case "getGivenList":
                    getGivenList()
                    break;

            }





        });

        function getReceivedList (){
            console.log("getReceivedList")
            BurritoStore.getUserScore().then((users) => {
                console.log("users", users)
                const result = mergeData(serverStoredSlackUsers(), users);
                ws.send(JSON.stringify({event:'receivedList', data:result}));
            });
        }


        function getUserStats (user){
            BurritoStore.getGivers(user)
                .then(users => mergeData(serverStoredSlackUsers(), users))
                .then((givers) => {
                    BurritoStore.getGiven(user).then((gived) => {
                        BurritoStore.getUserScore(user).then((userScoreData) => {
                            const result = mergeData(serverStoredSlackUsers(), userScoreData);
                            console.log("result",result)
                            const obj = {
                                user: result[0],
                                gived,
                                givers,
                            };
                            console.log(obj)
                            ws.send(JSON.stringify({event:'userStats', data:obj}));
                        });
                    });
                });
        }

        function getGivenList () {
            BurritoStore.getUserScore().then((users) => {
                const result = mergeData(serverStoredSlackUsers(), users.map((user) => {
                    user._id = user.from;
                    return user;
                }));
                ws.send(JSON.stringify({event:'givenList', data:result}));
            });
        }
        ws.on('getGivenList', function incoming() {

        });

        ws.on('getUserStats', function incoming(user) {

        });













    });

/*
    BurritoStore.on('GIVE', ({ user }) => {
        BurritoStore.getUserScore(user).then((result) => {
            const users = mergeData(serverStoredSlackUsers(), result);

            io.emit('GIVE', users);
        });
    });

    BurritoStore.on('TAKE_AWAY', ({ user }) => {
        BurritoStore.getUserScore(user).then((result) => {
            const users = mergeData(serverStoredSlackUsers(), result);

            io.emit('TAKE_AWAY', users);
        });
    });


        Socket.io
    */

    log.info(`Webserver listening to: ${port}`);
    server.listen(port);
});