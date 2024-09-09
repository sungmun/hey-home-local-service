import { Request, Response } from 'express';
import serivce from './service';
import mResponse from '../../components/response';

class HomeController {
  async putMode(req: Request, res: Response) {
    return serivce.setMode(req.body.mode).then(mResponse.respondWithNoContent(res)).catch(mResponse.handleError(res));
  }
  async putRoomTemperature(req: Request, res: Response) {
    return serivce
      .setRoomTemperature(req.body)
      .then(mResponse.respondWithNoContent(res))
      .catch(mResponse.handleError(res));
  }
}

export const homeController = new HomeController();
