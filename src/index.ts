import * as http from 'node:http';
import logger from './config/logger';
import app from './config/express';
import config from './config/environment';

const server: http.Server = new http.Server(app());
// const socket = new Socket(server)

server.listen(config.port);

server.on('error', (e: Error) => {
  logger.error('Error starting server', { error: e });
});

server.on('listening', () => {
  logger.info(`Server started on port ${config.port} on env ${process.env.NODE_ENV || 'dev'}`);
});

export default {
  server,
  // socket,
};
