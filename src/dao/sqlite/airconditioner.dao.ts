import sqliteConnect from '../../config/databases/sqlite/sqlite.connect';
import { Airconditioner } from '../../types/device.type';

const insertAirconditioner = async (deviceId: string) => {
  const client = sqliteConnect.getClient();
  const statement = client.prepare(`INSERT OR IGNORE INTO Airconditioner(deviceId) VALUES (?)`);

  statement.run(deviceId);
};

const updateChangePowerByDeviceId = (power: boolean, deviceId: string) => {
  const client = sqliteConnect.getClient();
  const statement = client.prepare(`UPDATE Airconditioner SET power=?,updatedAt=current_timestamp WHERE deviceId=?`);

  return statement.run(power ? 1 : 0, deviceId);
};

const getAirconditionerByDeviceId = (deviceId: string): Airconditioner => {
  const client = sqliteConnect.getClient();
  const statement = client.prepare(`SELECT * from Airconditioner WHERE deviceId=?`);

  return <Airconditioner>statement.get(deviceId);
};

export default { insertAirconditioner, updateChangePowerByDeviceId, getAirconditionerByDeviceId };
