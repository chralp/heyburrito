import log from 'bog';
import WebSocket from 'ws';
import mergeUserData from '../lib/mergeUserData';
import BurritoStore from '../store/BurritoStore';
import config from '../config';

export default () => {

    const wss = new WebSocket.Server({ port: config('WSS_PORT') });

    log.info(`WebSocketServer started on port ${config('WSS_PORT')}`)
    wss.broadcast = (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    BurritoStore.on('GIVE', (user) => {
        BurritoStore.getUserScore({ user }).then((result) => {
            const user: any = mergeUserData(result);

            if (user.length) {
                wss.broadcast(JSON.stringify({ event: 'GIVE', data: user[0] }));
            }
        });
    });

    BurritoStore.on('TAKE_AWAY', (user) => {
        BurritoStore.getUserScore({ user }).then((result) => {
            const user: any = mergeUserData(result);

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

            async getReceivedList() {

                const [users] = await Promise.all([
                    BurritoStore.getUserScore({ scoreType: 'to' }),
                ])

                ws.send(JSON.stringify({
                    event: 'receivedList',
                    data: mergeUserData(users),
                }));

            },

            async getUserStats(user: string) {
                console.log(user);
                const [givers, given, userScore] = await Promise.all([
                    BurritoStore.getGivers(user),
                    BurritoStore.getGiven(user),
                    BurritoStore.getUserScore({ user }),
                ]);

                const data = {
                    user: (mergeUserData(userScore))[0],
                    gived: mergeUserData(given),
                    givers: mergeUserData(givers),
                }
                console.log(data);
                ws.send(JSON.stringify({
                    event: 'userStats',
                    data
                }));
            },

            async getGivenList() {

                const [users] = await Promise.all([
                    BurritoStore.getUserScore({ scoreType: 'from' }),
                ]);

                ws.send(JSON.stringify({
                    event: 'givenList',
                    data: mergeUserData(users.map((user) => user))
                }));
            }
        }
    });
};
