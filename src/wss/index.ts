import * as log from 'bog';
import ws from 'ws';
import BurritoStore from '../store/BurritoStore';
import { getUserScore } from '../middleware';
import config from '../config';

export default () => {
    const wss = new ws.Server({ port: config.http.wss_port });
    log.info(`WebSocketServer started on port ${config.http.wss_port}`);

    wss.broadcast = (data: any) => {
        wss.clients.forEach((client: any) => {
            if (client.readyState === ws.OPEN) {
                client.send(data);
            }
        });
    };

    BurritoStore.on('GIVE', async (to: string, from: string) => {
        wss.broadcast(JSON.stringify({ event: 'GIVE', data: { to, from } }));
    });

    BurritoStore.on('TAKE_AWAY', async (to: string, from: string) => {
        wss.broadcast(JSON.stringify({ event: 'TAKE_AWAY', data: { to, from } }));
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
            async userScore(data) {
                const { user, listType, scoreType } = data;
                const result = await getUserScore(user, listType, scoreType);
                ws.send(JSON.stringify({
                    event: 'userScore',
                    data: result,
                }));
            }
        }
    });
};
