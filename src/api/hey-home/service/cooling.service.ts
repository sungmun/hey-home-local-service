import deviceDao from './../../../dao/sqlite/device.dao';
// import deviceLogDao from './../../../dao/sqlite/device-log.dao';
import liveDeviceDao from './../../../dao/local/live-device.dao';
import { Device, Sensor } from './../../../types/device.type';
import heyHomeAgent from './../../../components/hey-home-request';
import _ from 'lodash';
import { Room } from '../../../types/room.type';
import logger from '../../../config/logger';
import { EventEmitter } from 'stream';
import airconditionerDao from '../../../dao/sqlite/airconditioner.dao';

const airConditionerChange = async (airConditioners: Device[], deviceStatus, eventEmitter?: EventEmitter) => {
  const power = {
    켜짐: 'true',
    꺼짐: 'false',
  };

  const filterAirConditioners = await Promise.all(
    airConditioners.filter(async airConditioner =>
      airconditionerDao
        .getAirconditionerByDeviceId(airConditioner.id)
        .then(airconRecord => (airconRecord.power === 1 ? '켜짐' : '꺼짐') !== deviceStatus.power),
    ),
  );

  if (filterAirConditioners.length === 0) return;

  logger.info(`aircon ${deviceStatus.power}`);
  await filterAirConditioners.reduce(async (promise, airConditioner) => {
    promise
      .then(async () =>
        heyHomeAgent.post(`/openapi/control/${airConditioner.id}`, {
          requirments: {
            ...deviceStatus,
            power: power[deviceStatus.power],
          },
        }),
      )
      .then(async () => airconStatusChange(airConditioner.id, eventEmitter));
  }, Promise.resolve());
};

const airconStatusChange = async (airconId: string, eventEmitter?: EventEmitter) => {
  if (eventEmitter === undefined) return;
  const res = await heyHomeAgent.get(`/openapi/device/${airconId}`);
  const state = res.data.deviceState;
  eventEmitter.emit(airconId, state);
};

const exec = async (sensor: Sensor, room: Room, eventEmitter?: EventEmitter) => {
  const airConditioners = await deviceDao.findDeviceByDeviceType('IrAirconditioner');

  let power = 'true';
  if (sensor.temperature > room.maxTemperature) {
    power = '켜짐';
  } else if (sensor.temperature < room.minTemperature) {
    power = '꺼짐';
  } else {
    logger.info(`cooling process 중지(${room.name})`, {
      data: {
        max: sensor.temperature <= room.maxTemperature,
        min: sensor.temperature >= room.minTemperature,
        temperature: sensor.temperature,
        maxTemperature: room.maxTemperature,
        minTemperature: room.minTemperature,
      },
    });
    return;
  }

  const deviceStatus = { power, temperature: 18, fanSpeed: 3, mode: 0 };
  await airConditionerChange(airConditioners, deviceStatus, eventEmitter);
};

export default { exec };
