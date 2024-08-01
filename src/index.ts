import http from 'node:http';
import https from 'node:https';
import logger from './config/logger';
import app from './config/express';
import config from './config/environment';
import environment from './config/environment';
import fs from 'node:fs';

let server: http.Server;
if (environment.https.key !== '' && environment.https.crt !== '') {
  server = new https.Server(
    {
      key: fs.readFileSync(environment.https.key),
      cert: fs.readFileSync(environment.https.crt),
    },
    app(),
  );
} else {
  server = new http.Server(app());
}

// const socket = new Socket(server)

server.listen(config.port);

server.on('error', (e: Error) => {
  logger.error('Error starting server', { error: e });
});

server.on('listening', () => {
  logger.info(
    `Server started on port ${config.port} on env ${process.env.NODE_ENV || 'dev'} ${
      environment.https.key !== '' && environment.https.crt !== '' ? 'TLS/SSL apply' : ''
    }`,
  );
});

export default {
  server,
  // socket,
};
