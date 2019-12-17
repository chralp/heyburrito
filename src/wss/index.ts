import log from 'bog';
import WebSocket from 'ws';
import mergeUserData from '../lib/mergeUserData';
import BurritoStore from '../store/BurritoStore';
import Middleware from '../Middleware';
import config from '../config';

export default () => {

    const wss = new WebSocket.Server({ port: config.http.wss_port });

    log.info(`WebSocketServer started on port ${config.http.wss_port}`);

    wss.broadcast = (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };

    BurritoStore.on('GIVE', async (user: string) => {

        const result = await Middleware.getUserScore({ user });
        if (result.length) {
            wss.broadcast(JSON.stringify({ event: 'GIVE', data: result[0] }));
        }
    });

    BurritoStore.on('TAKE_AWAY', async (user) => {

        const result = Middleware.getUserScore({ user });
        if (user.length) {
            wss.broadcast(JSON.stringify({ event: 'TAKE_AWAY', data: result[0] }));
        }
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

                const users = await Middleware.getUserScore({ scoreType: 'to' });

                ws.send(JSON.stringify({
                    event: 'receivedList',
                    data: users,
                }));

            },

            async getUserStats(userId: string) {

                const { user, gived, givers }: any = await Middleware.getUserStats(userId);
                const data = {
                    user,
                    gived,
                    givers,
                }

                ws.send(JSON.stringify({
                    event: 'userStats',
                    data
                }));
            },

            async getGivenList() {

                const users = await Middleware.getUserScore({ scoreType: 'from' });
                ws.send(JSON.stringify({
                    event: 'givenList',
                    data: mergeUserData(users.map((user) => user))
                }));
            }
        }
    });
};
