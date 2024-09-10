import coolingService from './api/hey-home/service/cooling.service';
import EventEmitter from 'events';
import roomDao from './dao/sqlite/room.dao';
import logger, { DeviceLogger } from './config/logger';
import deviceDao from './dao/sqlite/device.dao';

export default async (eventEmitter: EventEmitter) => {
  const rooms = await roomDao.findAllRooms();
  rooms.forEach(room => {
    eventEmitter.on(room.sensorId, data => {
      return roomDao
        .findOneRoomBySensorId(room.sensorId)
        .then(eventRoom => {
          if (eventRoom.active === 0) return;
          logger.info(`cooling processing...(${eventRoom.name})`, { data });
          return coolingService.exec({ ...data, sensorId: room.sensorId }, eventRoom, eventEmitter);
        })
        .catch(error => {
          logger.error('cooling processing error', { data: error });
        })
        .finally(() => {
          logger.info(`cooling process end`);
        });
    });
  });
  const aircons = await deviceDao.findDeviceByDeviceType('IrAirconditioner');

  aircons.forEach(aircon => {
    let changeTime = null;
    eventEmitter.on(aircon.id, data => {
      if (changeTime?.power === data.power) return;
      if (changeTime?.power != null) {
        DeviceLogger.info(
          `change aircon status delay: ${Math.floor((Date.now() - changeTime.changeTime) / 1000 / 60)}분`,
        );
      }
      changeTime.power = data.power;

      changeTime.changeTime = Date.now();
    });
  });
};
