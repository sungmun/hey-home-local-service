import logger from '../../../config/logger';
import { DatabaseSync } from 'node:sqlite';

let client: InstanceType<typeof DatabaseSync> = null;

const createConnection = () => {
  try {
    client = new DatabaseSync('./sql_lite.sqlite');
  } catch (err) {
    logger.error(`Sqlite Database connection error: ${err}`, { error: err });
  }

  return client;
};

/**
 * sqlite 클라이언트 반환
 *
 * @returns {Sequelize}
 */
const getClient = () => {
  if (client !== null) {
    return client;
  }

  client = createConnection();

  return client;
};

export default { getClient };
