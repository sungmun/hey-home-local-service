import { Router } from 'express';
import { homeController } from './home.controller';

const router = Router();

router.put('/mode', homeController.putMode);

export default router;
