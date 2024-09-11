import path from 'path';
import _ from 'lodash';

const heyCode = require(process.env.PWD + '/hey-code.json');

/**
 * 환경 변수
 */
export default {
  // 기준 환경
  env: process.env.NODE_ENV || 'development',
  serviceName: require(process.env.PWD + '/package.json').name,
  // 서버 루트 경로
  root: path.normalize(`${__dirname}/../..`),
  domain: process.env.DOMAIN || `https://localhost:${process.env.PORT || 8080}`,
  // 서버 IP 주소
  ip: process.env.IP || undefined,

  // 서버 포트
  port: process.env.PORT || 8080,

  // 헬스체크 경로
  healthCheck: process.env.HEALTH_CHECK_URL || '/health',

  // 기준 시간대
  timezone: process.env.TZ || 'Asia/Seoul',
  appRoot: process.env.PWD,
  heyHome: {
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    refreshToken: heyCode.refresh_token || '',
    accessToken: heyCode.access_token || '',
  },
  webhook: {
    url: process.env.WEBHOOK_URL || '',
  },
  https: {
    key: process.env.HTTPS_KEY_PATH || '',
    crt: process.env.HTTPS_CRT_PATH || '',
  },
};
