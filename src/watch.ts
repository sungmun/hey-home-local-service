import coolingService from './api/hey-home/service/cooling.service';
import EventEmitter from 'events';
import roomDao from './dao/sqlite/room.dao';
import logger, { DeviceLogger } from './config/logger';
import deviceDao from './dao/sqlite/device.dao';
import axios from 'axios';
import environment from './config/environment';
import airconditionerDao from './dao/sqlite/airconditioner.dao';
import { clearTimeout, setTimeout } from 'timers';

export default async (eventEmitter: EventEmitter) => {
  const rooms = await roomDao.findAllRooms();
  rooms.forEach(room => {
    eventEmitter.on(room.sensorId, data => {
      return roomDao
        .findOneRoomBySensorId(room.sensorId)
        .then(eventRoom => {
          if ([null, 0].includes(eventRoom.active)) return;
          logger.info(`cooling processing(${eventRoom.name})...`, { data: { sensor: data, room: eventRoom } });
          return coolingService.exec({ ...data, sensorId: room.sensorId }, eventRoom, eventEmitter);
        })
        .catch(error => {
          logger.error('cooling processing error', { data: error });
        });
    });
  });

  const aircons = await deviceDao.findDeviceByDeviceType('IrAirconditioner');

  await Promise.all(
    aircons.map(async ({ id, name }) => {
      let airconTimer;
      eventEmitter.on(id, async data => {
        const aircon = airconditionerDao.getAirconditionerByDeviceId(id);
        const nowPower = [1, true, '켜짐', 'true'].includes(data.power);
        const updateAt = Date.parse(aircon.updatedAt) + 9 * 60 * 60 * 1000;

        if (aircon.power === (nowPower ? 1 : 0)) return;
        if (nowPower) {
          airconTimer = setTimeout(() => {
            const { updatedAt } = airconditionerDao.getAirconditionerByDeviceId(id);
            if (updatedAt !== aircon.updatedAt) return;
            coolingService.fixOnOffSetExec(false);
          }, 1000 * 60 * 60);
        } else if (airconTimer !== undefined) {
          clearTimeout(airconTimer);
        }

        const delayTime = Math.floor((Date.now() - updateAt) / 1000 / 60);
        DeviceLogger.silly(`change aircon status delay (${data?.power}): ${delayTime}분`);
        await axios.post(
          environment.webhook.url,
          `에어컨(${name})이 ${data.power} 으로 변경되는데 ${delayTime}분 걸렸습니다`,
          {
            headers: {
              Title: `aircon ${data.power === '켜짐' ? 'on' : 'off'}`,
            },
          },
        );

        await airconditionerDao.updateChangePowerByDeviceId(nowPower, id);
      });
    }),
  );
};
