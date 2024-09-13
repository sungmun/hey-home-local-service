import logger from './../../../config/logger';
import heyHomeAgent from './../../../components/hey-home-request';
import deviceDao from './../../../dao/sqlite/device.dao';
import { Device } from './../../../types/device.type';
import EventEmitter from 'events';
import roomDao from '../../../dao/sqlite/room.dao';

const getDeviceCloudLiveData = async (device: Device) => {
  let res = null;

  if (device.deviceType === 'SensorTh') {
    res = await heyHomeAgent.get(`/openapi/device/TH/${device.id}`);
  } else {
    res = await heyHomeAgent.get(`/openapi/device/${device.id}`);
  }

  return res.data;
};

const exec = async (eventEmitter: EventEmitter) => {
  const devices = await deviceDao.findAllDevices();
  logger.verbose;
  await devices.reduce(async (promise, cur) => {
    return promise.then(async () => {
      const liveData = await getDeviceCloudLiveData(cur).then(device => device.deviceState);
      if (cur.roomId && cur.deviceType === 'SensorTh') {
        await roomDao.updateRoomTemperature({
          id: cur.roomId,
          sensorId: cur.id,
          temperature: liveData.temperature,
        });
      }
      eventEmitter.emit(cur.id, liveData);
    });
  }, Promise.resolve());
};

export default { exec };
