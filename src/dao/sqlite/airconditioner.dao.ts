import sqliteConnect from '../../config/databases/sqlite/sqlite.connect';
import { Airconditioner } from '../../types/device.type';

const insertAirconditioner = async (deviceId: string): Promise<void> => {
  const client = sqliteConnect.getClient();
  const statement = client.prepare(`INSERT OR IGNORE INTO Airconditioner(deviceId) VALUES (?)`);

  await statement.run(deviceId);
};

const updateChangePowerByDeviceId = async (power: boolean, deviceId: string): Promise<void> => {
  const client = sqliteConnect.getClient();
  client.exec(
    `UPDATE Airconditioner SET power=${power ? 1 : 0},updatedAt=current_timestamp WHERE deviceId='${deviceId}'`,
  );
};

const getAirconditionerByDeviceId = (deviceId: string) => {
  const client = sqliteConnect.getClient();
  const statement = client.prepare(`SELECT * from Airconditioner WHERE deviceId=?`);

  return <Airconditioner>statement.get(deviceId);
};

export default { insertAirconditioner, updateChangePowerByDeviceId, getAirconditionerByDeviceId };
