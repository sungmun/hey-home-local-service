import coolingService from './api/hey-home/service/cooling.service';
import EventEmitter from 'events';
import roomDao from './dao/sqlite/room.dao';
import logger, { DeviceLogger } from './config/logger';
import deviceDao from './dao/sqlite/device.dao';
import axios from 'axios';
import environment from './config/environment';

export default async (eventEmitter: EventEmitter) => {
  const rooms = await roomDao.findAllRooms();
  rooms.forEach(room => {
    eventEmitter.on(room.sensorId, data => {
      return roomDao
        .findOneRoomBySensorId(room.sensorId)
        .then(eventRoom => {
          logger.info(`cooling process start(${eventRoom.name})`);
          if ([null, 0].includes(eventRoom.active)) return;
          logger.info(`cooling processing...`, { data: { data, eventRoom } });
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
    let changeTime = { power: null, changeTime: null };
    eventEmitter.on(aircon.id, data => {
      if (changeTime?.power === data.power) return;
      if (changeTime?.power != null) {
        DeviceLogger.silly(
          `change aircon status delay (${changeTime?.power}): ${Math.floor(
            (Date.now() - changeTime.changeTime) / 1000 / 60,
          )}분`,
        );
        axios.post(
          environment.webhook.url,
          `에어컨(${aircon.name})이 ${changeTime.power} 으로 변경되는데 ${Math.floor(
            (Date.now() - changeTime.changeTime) / 1000 / 60,
          )}분 걸렸습니다`,
          {
            headers: {
              title: `에어컨 ${changeTime.power}`,
            },
          },
        );
      }
      changeTime.power = data.power;
      changeTime.changeTime = Date.now();
    });
  });
};
