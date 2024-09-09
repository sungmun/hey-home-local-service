import type { Device } from './../../types/device.type';
import sqliteConnect from '../../config/databases/sqlite/sqlite.connect';
import logger from '../../config/logger';

const bulkInsertDevices = async (devices: Device[]) => {
  const client = sqliteConnect.getClient();
  const query = `INSERT OR REPLACE INTO Devices(id,name,deviceType,modelName,familyId,roomId,category,online,hasSubDevices) VALUES ${devices
    .map(
      device =>
        `('${device.id}','${device.name}','${device.deviceType}','${device.modelName}','${device.familyId}',${
          device.roomId !== undefined ? `${device.roomId}` : null
        },'${device.category}',${device.online},${device.hasSubDevices})`,
    )
    .join(',')}`;

  await client.exec(query);
};

const findAllDevices = async (): Promise<Device[]> => {
  const client = sqliteConnect.getClient();
  const query = await client.prepare('SELECT * FROM Devices');
  return <Device[]>query.all();
};

const findRoomDevices = async (roomId: string): Promise<Device[]> => {
  const client = sqliteConnect.getClient();
  const query = await client.prepare('SELECT * FROM Devices WHERE roomId=?');
  return <Device[]>query.all(roomId);
};

const findDeviceByDeviceType = async (deviceType: string): Promise<Device[]> => {
  const client = sqliteConnect.getClient();
  const query = await client.prepare('SELECT * FROM Devices WHERE deviceType=?');
  return <Device[]>query.all(deviceType);
};

export default { bulkInsertDevices, findAllDevices, findRoomDevices, findDeviceByDeviceType };
