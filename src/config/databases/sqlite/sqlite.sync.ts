import logger from '../../../config/logger';
import { DatabaseSync } from 'node:sqlite';

const makeDevicesTables = async (client: InstanceType<typeof DatabaseSync>) => {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS Devices(
        id TEXT PRIMARY KEY,
        name TEXT,
        deviceType TEXT,
        modelName TEXT,
        familyId TEXT,
        roomId TEXT,
        category TEXT,
        online TINYINT,
        hasSubDevices TINYINT
    )`);
};

const makeAirconditionerTables = async (client: InstanceType<typeof DatabaseSync>) => {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS Airconditioner(
        deviceId TEXT PRIMARY KEY,
        power TINYINT NOT NULL DEFAULT 0,
        updatedAt INTEGER NOT NULL DEFAULT current_timestamp
    )`);
};

const makeRoomTables = async (client: InstanceType<typeof DatabaseSync>) => {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS Rooms(
        id TEXT PRIMARY KEY,
        name TEXT,
        temperature INTEGER,
        sensorId TEXT,
        active TINYINT,
        minTemperature INTEGER NOT NULL DEFAULT 2750,
        maxTemperature INTEGER NOT NULL DEFAULT 2850
    )`);
};

const sync = async (client: InstanceType<typeof DatabaseSync>) => {
  return Promise.all([makeDevicesTables(client), makeRoomTables(client), makeAirconditionerTables(client)])
    .then(() => {
      logger.info('sqlite tables create success');
    })
    .catch(e => {
      logger.error('sqlite tables create error', { data: e });
      throw e;
    });
};

export default { sync };
