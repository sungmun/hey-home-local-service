import path from 'path';
import _ from 'lodash';

/**
 * 환경 변수
 */
export default {
  // 기준 환경
  env: process.env.NODE_ENV || 'development',
  serviceName: require('../../package.json').name,
  // 서버 루트 경로
  root: path.normalize(`${__dirname}/../..`),

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
    code: require('../../hey-code.json')?.name,
    time: require('../../hey-code.json')?.time,
  },
};
