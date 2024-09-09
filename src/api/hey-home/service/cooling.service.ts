import deviceDao from './../../../dao/sqlite/device.dao';
import deviceLogDao from './../../../dao/sqlite/device-log.dao';
import liveDeviceDao from './../../../dao/local/live-device.dao';
import { Sensor } from './../../../types/device.type';
import heyHomeAgent from './../../../components/hey-home-request';
import _ from 'lodash';
import { Room } from '../../../types/room.type';

const MIN_TEMPERATURE = 27.5;
const MAX_TEMPERATURE = 28.5;

const airConditionerOn = async airConditioners => {
  await airConditioners
    .filter(airConditioner => {
      const id = airConditioner.id;
      const status = liveDeviceDao.liveDevices.get(id);

      if (status) {
        return status.power !== '켜짐';
      }
      return true;
    })
    .reduce(async (promise, airConditioner) => {
      const deviceStatus = { power: 'true', temperature: 18, fanSpeed: 3, mode: 0 };
      promise
        .then(async () =>
          heyHomeAgent.post(`/openapi/control/${airConditioner.id}`, {
            requirments: deviceStatus,
          }),
        )
        .then(async () => deviceLogDao.insertLog(airConditioner, deviceStatus))
        .then(() => {
          liveDeviceDao.liveDevices.set(airConditioner.id, { ...deviceStatus, power: '켜짐' });
        });
    }, Promise.resolve());
};
const airConditionerOff = async airConditioners => {
  await airConditioners
    .filter(airConditioner => {
      const id = airConditioner.id;
      const status = liveDeviceDao.liveDevices.get(id);
      return status?.power !== '꺼짐';
    })
    .reduce(async (promise, airConditioner) => {
      const deviceStatus = { power: '꺼짐', temperature: 17, fanSpeed: 3, mode: 0 };
      promise
        .then(async () =>
          heyHomeAgent.post(`/openapi/control/${airConditioner.id}`, {
            requirments: deviceStatus,
          }),
        )
        .then(async () => deviceLogDao.insertLog(airConditioner, deviceStatus))
        .then(() => {
          liveDeviceDao.liveDevices.set(airConditioner.id, deviceStatus);
        });
    }, Promise.resolve());
};

const exec = async (sensor: Sensor, room: Room) => {
  const airConditioners = await deviceDao.findDeviceByDeviceType('IrAirconditioner');

  if (sensor.temperature > room.maxTemperature) {
    await airConditionerOn(airConditioners);
    return;
  } else if (sensor.temperature < room.minTemperature) {
    await airConditionerOff(airConditioners);
    return;
  }
};

export default { exec };
