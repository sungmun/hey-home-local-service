import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import errorHandler from 'errorhandler';
import { RouterLogger } from '../logger';

import env from '../environment';
import constant from '../environment.constants';
import amqp from 'amqplib/callback_api';
import router from '../../route';

const { ENV } = constant;

/**
 * express 설정
 */
export default function () {
  const app: express.Express = express();

  app.use(helmet());

  app.set('views', path.join(__dirname, '../../views'));
  app.set('view engine', 'pug');

  app.use((req, res, next) => {
    RouterLogger.http(`${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      query: req.query,
      params: req.params,
      baseUrl: req.baseUrl,
      hostname: req.hostname,
      body: req.body,
      headers: req.headers,
    });
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../../../public')));

  router(app);

  if (env.env === ENV.DEVELOPMENT) {
    // 에러 핸들러는 개발 모드에서만 사용되며, 마지막에 위치해야 한다.
    app.use(errorHandler());
  }

  return app;
}
