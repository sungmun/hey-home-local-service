import setModeService from './set-mode.service';
import setRoomTemperatureService from './set-room-temperature.service';
export default {
  setMode: setModeService.exec,
  setRoomTemperature: setRoomTemperatureService.exec,
};
