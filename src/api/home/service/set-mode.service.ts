import logger from './../../../config/logger';
import modeModel from '../../../model/common/mode.model';
import roomDao from '../../../dao/sqlite/room.dao';

const exec = async (mode: string) => {
  await roomDao.updateRoomActiveByName(mode);
};

export default { exec };
