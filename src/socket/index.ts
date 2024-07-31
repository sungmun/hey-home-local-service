import { Server } from 'http';
import socket from 'socket.io';

export class Socket {
  public io: socket.Server;

  constructor(http: Server) {
    this.io = new socket.Server(http);
    this.connect();
  }

  public connect() {
    this.io.on('connection', (client: socket.Socket) => {
      // eslint-disable-next-line no-console
      console.info(` connected : ${client.id}`);
      this.handlers(client);
    });
  }

  public handlers(client: socket.Socket) {
    client.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.info(`Socket disconnected : ${client.id}`);
    });
  }
}
