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

const makeDevicesLogTables = async (client: InstanceType<typeof DatabaseSync>) => {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS DeviceLog(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deviceId TEXT,
        name TEXT,
        deviceType TEXT,
        roomId TEXT,
        json TEXT,
        time TEXT NOT NULL DEFAULT current_timestamp
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
  return Promise.all([makeDevicesTables(client), makeRoomTables(client), makeDevicesLogTables(client)])
    .then(() => {
      logger.info('sqlite tables create success');
    })
    .catch(e => {
      logger.error('sqlite tables create error', { data: e });
      throw e;
    });
};

export default { sync };