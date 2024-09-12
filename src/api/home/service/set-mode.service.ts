import roomDao from '../../../dao/sqlite/room.dao';

const exec = async (mode: string) => {
  await roomDao.updateRoomActiveByName(mode);
  const room = roomDao.findOneRoomByName(mode);
  return room;
};

export default { exec };
