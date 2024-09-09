import sqliteConnect from '../../config/databases/sqlite/sqlite.connect';
import type { Device } from './../../types/device.type';
const insertLog = async (device: Device, status) => {
  const client = sqliteConnect.getClient();
  const statement = client.prepare(`INSERT INTO DeviceLog(deviceId,name,deviceType,roomId,json) VALUES (?,?,?,?,?)`);
  console.log(JSON.stringify(status));
  statement.run(device.id, device.name, device.deviceType, device.roomId, JSON.stringify(status));
};

const getLogs = () => {
  const client = sqliteConnect.getClient();
  const statement = client.prepare(`SELECT * FROM DeviceLog ORDER BY id DESC LIMIT 100 `);

  return statement.all();
};
export default { insertLog, getLogs };
