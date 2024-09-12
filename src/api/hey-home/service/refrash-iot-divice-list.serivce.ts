import heyHomeAgent from '../../../components/hey-home-request';
import deviceDao from '../../../dao/sqlite/device.dao';
import roomDao from '../../../dao/sqlite/room.dao';
import _ from 'lodash';
import { Device } from '../../../types/device.type';
import airconditionerDao from '../../../dao/sqlite/airconditioner.dao';

const syncIotDevices = async devices => {
  await deviceDao.bulkInsertDevices(
    devices.map(device => ({
      ...device,
      hasSubDevices: device.hasSubDevices ? 1 : 0,
      online: device.online ? 1 : 0,
    })),
  );
};

const getHomes = async () => {
  const res = await heyHomeAgent.get(`/openapi/homes`);
  return res.data.result;
};

const getRooms = async (homeId: number): Promise<[{ name: string; room_id: number }]> => {
  const res = await heyHomeAgent.get(`/openapi/homes/${homeId}/rooms`);
  return res.data.rooms.map(room => ({ id: room.room_id, name: room.name, homeId }));
};

const getRoomDevices = async (hoomId: number, roomId: number) => {
  const res = await heyHomeAgent.get(`/openapi/homes/${hoomId}/rooms/${roomId}/devices`);
  return res.data.map(device => ({
    ...device,
    roomId,
  }));
};

const exec = async () => {
  const homes = await getHomes();

  let rooms = [];
  await homes.reduce(
    async (promise, home) => promise.then(async () => rooms.push(...(await getRooms(home.homeId)))),
    Promise.resolve(),
  );
  // console.log('rooms', rooms);
  await roomDao.bulkInsertRooms(rooms);

  let devices: Device[] = [];
  await rooms.reduce(
    async (promise, room) => promise.then(async () => devices.push(...(await getRoomDevices(room.homeId, room.id)))),
    Promise.resolve(),
  );

  const res = await heyHomeAgent.get(`/openapi/devices`);
  const uniqDevices: Device[] = _.uniqBy([...devices, ...res.data], 'id');
  uniqDevices
    .filter(device => device.deviceType === 'IrAirconditioner')
    .map(device => {
      airconditionerDao.insertAirconditioner(device.id);
    });
  await syncIotDevices(uniqDevices);
};

export default { exec };
