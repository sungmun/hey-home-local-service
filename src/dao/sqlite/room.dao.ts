import type { Room } from './../../types/room.type';
import sqliteConnect from '../../config/databases/sqlite/sqlite.connect';

const bulkInsertRooms = async (rooms: Pick<Room, 'id' | 'name'>[]) => {
  const client = sqliteConnect.getClient();
  const query = `INSERT OR REPLACE INTO Rooms(id,name) VALUES ${rooms
    .map(room => `('${room.id}','${room.name}')`)
    .join(',')}`;

  await client.exec(query);
};

const updateRoomTemperature = async (room: Pick<Room, 'sensorId' | 'temperature' | 'id'>) => {
  const client = sqliteConnect.getClient();

  const statemnt = client.prepare('UPDATE Rooms SET sensorId=?, temperature=? WHERE id=?');

  statemnt.run(room.sensorId, room.temperature, room.id);
};

const updateRoomActiveByName = async (name: string) => {
  const client = sqliteConnect.getClient();

  const active = client.prepare('UPDATE Rooms SET active=1 WHERE name=?');
  const statemnt = client.prepare('UPDATE Rooms SET active=0 WHERE name!=?');

  active.run(name);
  statemnt.run(name);
};

const findAllRooms = async (): Promise<Room[]> => {
  const client = sqliteConnect.getClient();
  const query = await client.prepare('SELECT * FROM Rooms');
  return <Room[]>query.all();
};

const findOneRoomBySensorId = async (sensorId: string): Promise<Room> => {
  const client = sqliteConnect.getClient();
  const query = await client.prepare('SELECT * FROM Rooms WHERE sensorId=?');
  return <Room>query.get(sensorId);
};

const findOneRoomByName = async (name: string): Promise<Room> => {
  const client = sqliteConnect.getClient();
  const query = await client.prepare('SELECT * FROM Rooms WHERE name=?');
  return <Room>query.get(name);
};

const updateOneRoomMinTemperatureById = async (id: string, temperature: number) => {
  const client = sqliteConnect.getClient();
  let statemnt = client.prepare('UPDATE Rooms SET minTemperature=? WHERE id=?');

  statemnt.run(temperature, id);
};

const updateOneRoomMaxTemperatureById = async (id: string, temperature: number) => {
  const client = sqliteConnect.getClient();
  let statemnt = client.prepare('UPDATE Rooms SET maxTemperature=? WHERE id=?');

  statemnt.run(temperature, id);
};

export default {
  bulkInsertRooms,
  findAllRooms,
  updateRoomTemperature,
  updateRoomActiveByName,
  findOneRoomBySensorId,
  findOneRoomByName,
  updateOneRoomMinTemperatureById,
  updateOneRoomMaxTemperatureById,
};
