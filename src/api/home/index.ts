import { Router } from 'express';
import { homeController } from './home.controller';

const router = Router();

router.put('/mode', homeController.putMode);
router.put('/room', homeController.putRoomTemperature);

export default router;
