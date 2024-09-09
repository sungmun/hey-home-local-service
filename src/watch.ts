import coolingService from './api/hey-home/service/cooling.service';
import EventEmitter from 'events';
import roomDao from './dao/sqlite/room.dao';
import logger from './config/logger';

export default async (eventEmitter: EventEmitter) => {
  const rooms = await roomDao.findAllRooms();
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];

    eventEmitter.on(room.sensorId, data => {
      return roomDao
        .findOneRoomBySensorId(room.sensorId)
        .then(eventRoom => {
          if (eventRoom.active === 0) return;
          logger.info(`cooling processing...(${eventRoom.name})`, { data });
          return coolingService.exec({ ...data, sensorId: room.sensorId }, eventRoom);
        })
        .finally(() => {
          logger.info(`cooling process end`);
        });
    });
  }
};
