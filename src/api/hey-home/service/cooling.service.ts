import deviceDao from './../../../dao/sqlite/device.dao';
// import deviceLogDao from './../../../dao/sqlite/device-log.dao';
import liveDeviceDao from './../../../dao/local/live-device.dao';
import { Sensor } from './../../../types/device.type';
import heyHomeAgent from './../../../components/hey-home-request';
import _ from 'lodash';
import { Room } from '../../../types/room.type';
import { DeviceLogger } from '../../../config/logger';
import { EventEmitter } from 'stream';

const airConditionerOn = async (airConditioners, eventEmitter?: EventEmitter) => {
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
        .then(async () => airconStatusChange(airConditioner.id, eventEmitter));
    }, Promise.resolve());
};
const airConditionerOff = async (airConditioners, eventEmitter?: EventEmitter) => {
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
        .then(async () => airconStatusChange(airConditioner.id, eventEmitter));
    }, Promise.resolve());
};

const airconStatusChange = async (airconId: string, eventEmitter?: EventEmitter) => {
  if (eventEmitter === undefined) return;
  const res = await heyHomeAgent.get(`/openapi/device/${airconId}`);
  const state = res.data.deviceState;
  liveDeviceDao.liveDevices.set(airconId, state);
  eventEmitter.emit(airconId, state);
};

const exec = async (sensor: Sensor, room: Room, eventEmitter?: EventEmitter) => {
  const airConditioners = await deviceDao.findDeviceByDeviceType('IrAirconditioner');
  if (sensor.temperature >= room.maxTemperature && sensor.temperature >= room.minTemperature) {
    return;
  }
  if (sensor.temperature > room.maxTemperature) {
    await airConditionerOn(airConditioners, eventEmitter);
  } else if (sensor.temperature < room.minTemperature) {
    await airConditionerOff(airConditioners, eventEmitter);
  }
};

export default { exec };
