import redirectCodeService from './redirect-code.serivce';
import refrashAccessTokenService from './refrash-access-token.service';
import refrashIotDiviceListSerivce from './refrash-iot-divice-list.serivce';
export default {
  redirectCode: redirectCodeService.exec,
  refrashAccessToken: refrashAccessTokenService.exec,
};
