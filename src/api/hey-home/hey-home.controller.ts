import { Request, Response } from 'express';
import serivce from './service';
import mResponse from '../../components/response';

class HeyHomeController {
  async redirect(req: Request, res: Response) {
    const code = <string>req.query.code;
    console.log('code', code);
    return serivce.redirectCode(code).then(mResponse.respondWithOK(res)).catch(mResponse.handleError(res));
  }

  async refrashAccessToken(req: Request, res: Response) {
    return serivce.refrashAccessToken().then(mResponse.respondWithOK(res)).catch(mResponse.handleError(res));
  }
}

export const heyHomeController = new HeyHomeController();
