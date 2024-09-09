import roomDao from '../../../dao/sqlite/room.dao';

const exec = async (body: { roomName: string; min?: number; max?: number }) => {
  const room = await roomDao.findOneRoomByName(body.roomName);
  if (body.min) {
    await roomDao.updateOneRoomMinTemperatureById(room.id, body.min * 100);
  } else if (body.max) {
    await roomDao.updateOneRoomMaxTemperatureById(room.id, body.max * 100);
  }
};

export default { exec };
