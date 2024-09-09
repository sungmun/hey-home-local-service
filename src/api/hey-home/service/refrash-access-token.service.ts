import heyHomeAgent from '../../../components/hey-home-request';
import environment from '../../../config/environment';
import fs from 'node:fs/promises';
import logger from '../../../config/logger';
import { AxiosError } from 'axios';

const exec = async () => {
  const refreshToken = environment.heyHome.refreshToken;
  const heyCode = require(process.env.PWD + '/hey-code.json');

  if (Date.now() - 24 * 60 * 1000 > Date.parse(heyCode.expires_in)) {
    logger.debug('expires_in', { data: heyCode.expires_in });
    return;
  }
  const res = await heyHomeAgent
    .post(
      '/oauth/token',
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .catch((error: AxiosError) => {
      logger.error('hey home token refresh error', { data: error.response.data });
      throw error;
    });
  const data = res.data;

  const expiresIn = new Date(Date.now() + data.expires_in * 1000);
  environment.heyHome.accessToken = res.data.access_token;

  await fs.writeFile(environment.appRoot + '/hey-code.json', JSON.stringify({ ...res.data, expires_in: expiresIn }));
};

export default { exec };
