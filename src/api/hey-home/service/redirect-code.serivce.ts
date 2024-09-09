import heyHomeAgent from '../../../components/hey-home-request';
import environment from '../../../config/environment';
import fs from 'node:fs/promises';

const exec = async (code: string) => {
  const res = await heyHomeAgent.post('/oauth/token', undefined, {
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${environment.domain}/v1/hey-home/redirect`,
    },
  });
  environment.heyHome.accessToken = res.data.access_token;
  environment.heyHome.refreshToken = res.data.refresh_token;
  await fs.writeFile(environment.appRoot + '/hey-code.json', JSON.stringify(res.data));
};

export default { exec };
