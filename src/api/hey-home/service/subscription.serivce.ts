import heyHomeAgent from '../../../components/hey-home-request';
import environment from '../../../config/environment';

const exec = async () => {
  await heyHomeAgent.post(`/openapi/subscription?clientId=${environment.heyHome.clientId}`);
};

export default { exec };
