import { Router } from 'express';
import { heyHomeController } from './hey-home.controller';

const router = Router();

router.get('/redirect', heyHomeController.redirect);

export default router;
