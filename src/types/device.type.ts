export type Device = {
  id: string;
  name: string;
  deviceType: string;
  hasSubDevices: 0 | 1;
  modelName: string;
  familyId: string;
  category: string;
  online: 0 | 1;
  roomId: string;
};

export enum DEVICE_TYPE {
  SENSOR = 'SensorTh', // 온습도 센서
  AIRCONDITIONER = 'IrAirconditioner', // 에어컨
  SMART_PLUG = 'SmartPlugMini', // 스마트 플러그
}

export type Sensor = {
  temperature: number; // 온도
  humidity: number; // 습도
  battery: number; // 베터리
};
