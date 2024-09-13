import deviceDao from './../../../dao/sqlite/device.dao';
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

  const filterAirConditioners = airConditioners.filter(airConditioner => {
    const airconRecord = airconditionerDao.getAirconditionerByDeviceId(airConditioner.id);
    logger.info('aircon duplication', {
      data: {
        eqData: airconRecord.power === 1 ? '켜짐' : '꺼짐',
        air: airconRecord.power,
        changeAir: deviceStatus.power,
        result: (airconRecord.power === 1 ? '켜짐' : '꺼짐') !== deviceStatus.power,
      },
    });
    return (airconRecord.power === 1 ? '켜짐' : '꺼짐') !== deviceStatus.power;
  });

  logger.info('aircon filtering', {
    data: filterAirConditioners,
  });
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

const fixOnOffSetExec = async (fixOnOff: boolean, eventEmitter?: EventEmitter) => {
  const airConditioners = await deviceDao.findDeviceByDeviceType('IrAirconditioner');
  const power = fixOnOff ? '켜짐' : '꺼짐';
  const deviceStatus = { power, temperature: 18, fanSpeed: 3, mode: 0 };
  await airConditionerChange(airConditioners, deviceStatus, eventEmitter);
};

const exec = async (sensor: Sensor, room: Room, eventEmitter?: EventEmitter) => {
  const airConditioners = await deviceDao.findDeviceByDeviceType('IrAirconditioner');

  if (sensor.temperature <= room.maxTemperature && sensor.temperature >= room.minTemperature) {
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
  const defaultDeviceStatus = { power: '켜짐', temperature: 18, fanSpeed: 3, mode: 0 };
  if (sensor.temperature > room.maxTemperature) {
    await airConditionerChange(airConditioners, { ...defaultDeviceStatus, power: '켜짐' }, eventEmitter);
  } else if (sensor.temperature < room.minTemperature) {
    await airConditionerChange(airConditioners, { ...defaultDeviceStatus, power: '꺼짐' }, eventEmitter);
  }
};

export default { exec, fixOnOffSetExec };
