import https from 'node:https';
import axios from 'axios';
import environment from '../config/environment';
import logger from '../config/logger';
const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 3000,
  maxFreeSockets: 5,
  maxSockets: 10,
});

const heyHomeAgent = axios.create({
  httpsAgent,
  baseURL: 'https://goqual.io',
});
heyHomeAgent.interceptors.request.use(config => {
  if (config.url.includes('/oauth')) {
    config.auth = {
      password: environment.heyHome.clientSecret,
      username: environment.heyHome.clientId,
    };
  } else if (config.url.includes('/openapi')) {
    config.headers.Authorization = `Bearer ${environment.heyHome.accessToken}`;
  }
  logger.info('hey home request Logging', { data: { url: config.url, headers: config.headers, body: config.data } });
  return config;
});

heyHomeAgent.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    const code = error.code;
    const status = error.response?.status;
    if (code === 'ECONNABORTED' || status === 408) {
      logger.error('요청이 만료되었습니다.');
    }
  },
);
export default heyHomeAgent;
