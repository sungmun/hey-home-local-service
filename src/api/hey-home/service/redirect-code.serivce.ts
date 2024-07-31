import environment from '../../../config/environment';
import fs from 'node:fs/promises';

const exec = async (code: string) => {
  const data = {
    code,
    time: new Date(),
  };
  await fs.writeFile(environment.appRoot + '/hey-code.json', JSON.stringify(data));
};

export default { exec };
