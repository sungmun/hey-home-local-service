import { Request, Response } from 'express';
import serivce from './service';
import mResponse from '../../components/response';

class HeyHomeController {
  async redirect(req: Request, res: Response) {
    const code = <string>req.query.code;
    return serivce.redirectCode(code).then(mResponse.respondWithNoContent(res)).catch(mResponse.handleError(res));
  }
}

export const heyHomeController = new HeyHomeController();
