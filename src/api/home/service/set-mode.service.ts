import roomDao from '../../../dao/sqlite/room.dao';

const exec = async (mode: string) => {
  await roomDao.updateRoomActiveByName(mode);
  const room = await roomDao.findOneRoomByName(mode);
  return {
    ...room,
    minTemperature: room.minTemperature / 100,
    maxTemperature: room.maxTemperature / 100,
    temperature: room.temperature / 100,
  };
};

export default { exec };
