import log from 'loglevel';
import ws from 'ws';
import BurritoStore from '../store/BurritoStore';
import config from '../config';

export default () => {
  const wss = new ws.Server({ port: config.http.wss_port });
  log.info(`WebSocketServer started on port ${config.http.wss_port}`);
  const broadcast = (data: any) => {
    wss.clients.forEach((client: any) => {
      if (client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  };

  BurritoStore.on('GIVE', async (to: string, from: string) => {
    broadcast(JSON.stringify({ event: 'GIVE', data: { to, from } }));
  });

  BurritoStore.on('TAKE_AWAY', async (to: string, from: string) => {
    broadcast(JSON.stringify({ event: 'TAKE_AWAY', data: { to, from } }));
  });
};
