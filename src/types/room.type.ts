export type Room = {
  id: string;
  name: string;
  temperature: number;
  sensorId: string;
  minTemperature: number;
  maxTemperature: number;
  active: 0 | 1;
};
