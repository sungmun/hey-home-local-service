import http from 'node:http';
import https from 'node:https';
import logger from './config/logger';
import app from './config/express';

import env from './config/environment';
import DBConnect from './config/databases/init.connect';
import sqliteConnect from './config/databases/sqlite/sqlite.connect';
import sqliteSync from './config/databases/sqlite/sqlite.sync';
import fs from 'node:fs';
import amqp from 'amqplib';
import refrashIotDiviceListSerivce from './api/hey-home/service/refrash-iot-divice-list.serivce';
import refrashAccessTokenService from './api/hey-home/service/refrash-access-token.service';
import refreshAllIotDeviceDataService from './api/hey-home/service/refresh-all-iot-device-data.service';
import { setInterval } from 'node:timers/promises';
import { EventEmitter } from 'node:stream';
import watch from './watch';

const refrashAccessToken = async () => {
  return refrashAccessTokenService.exec().then(() => {
    logger.info('access token refresh success');
  });
};

const refrashIotDiviceList = async () => {
  await refrashIotDiviceListSerivce.exec().then(() => {
    logger.info('iot device refresh success');
  });
};

const watchIotDevices = async eventEmitter => {
  for await (const time of setInterval(1000 * 30)) {
    refreshAllIotDeviceDataService.exec(eventEmitter);
  }
};

let server: http.Server;
DBConnect.init();
sqliteSync.sync(sqliteConnect.getClient());

if (env.https.key !== '' && env.https.crt !== '') {
  server = new https.Server(
    {
      key: fs.readFileSync(env.https.key),
      cert: fs.readFileSync(env.https.crt),
    },
    app(),
  );
} else {
  server = new http.Server(app());
}

server.listen(env.port);
const eventEmitter = new EventEmitter();
Promise.resolve()
  .then(refrashAccessToken)
  .then(refrashIotDiviceList)
  .catch(error => {
    console.error(error);
    logger.error('refrash error', { data: error });
    throw error;
  })

  .then(async () => {
    logger.info('amqp connect start', {
      data: {
        url: `amqps://${env.heyHome.clientId}:${env.heyHome.clientSecret}@goqual.io:55001/`,
      },
    });
    return amqp.connect(`amqps://${env.heyHome.clientId}:${env.heyHome.clientSecret}@goqual.io:55001/`);
  })
  .then(connection => {
    logger.info('amqp connect success');
    return connection.createChannel();
  })
  .then(channel => {
    logger.info('amqp channel connect success');
    channel.consume(env.heyHome.clientId, msg => {
      logger.log('amqps message receive: ', { data: msg });
    });
  })
  .catch(error => {
    logger.error('amqps error', { data: error });
  })
  .then(async () => {
    await refreshAllIotDeviceDataService.exec(eventEmitter);
    watchIotDevices(eventEmitter);
  })
  .finally(() => {
    watch(eventEmitter).then(() => {
      logger.info('wating start');
    });
  });

server.on('error', (e: Error) => {
  logger.error('Error starting server', { data: e });
});

server.on('listening', () => {
  logger.info(
    `Server started on port ${env.port} on env ${env.env || 'dev'} ${
      env.https.key !== '' && env.https.crt !== '' ? 'TLS/SSL apply' : ''
    }`,
  );
});

export default {
  server,
  // socket,
};
