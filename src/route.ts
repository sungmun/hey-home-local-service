import { Express } from 'express';
import mResponse from './components/response';

import environment from './config/environment';
import { NotFoundError } from './components/error';

import heyHome from './api/hey-home';
import home from './api/home';
import modeModel from './model/common/mode.model';
import deviceLogDao from './dao/sqlite/device-log.dao';
const { healthCheck } = environment;

export default (app: Express) => {
  // example
  app.use('/v1/hey-home', heyHome);

  app.use('/v1/home', home);
  app.get('/v1/device/log', (req, res) => {
    res.status(200).json(deviceLogDao.getLogs());
  });
  // 헬스체크
  app.route(healthCheck).get(mResponse.sendOK);

  app.all('/*', () => {
    throw new NotFoundError({ message: '알 수 없는 요청입니다.', code: 'NOT_FOUND_REQUEST' });
  });
  // 공통 에러 핸들링
  // eslint-disable-next-line no-unused-vars
  app.use('/*', (err, req, res, next) => {
    Promise.reject(err).catch(mResponse.handleError(res));
  });
};
