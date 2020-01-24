import * as log from 'bog';
import ws from 'ws';
import BurritoStore from '../store/BurritoStore';
import { getUserStats } from '../middleware';
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

    BurritoStore.on('GIVE', async (user: string) => {
        const result = await getUserStats(user);
        console.log(result)
        if (result) {
            wss.broadcast(JSON.stringify({ event: 'GIVE', data: result[0] }));
        }
    });

    BurritoStore.on('TAKE_AWAY', async (user) => {
        const result = getUserStats(user);
        if (user) {
            wss.broadcast(JSON.stringify({ event: 'TAKE_AWAY', data: result[0] }));
        }
    });
};
