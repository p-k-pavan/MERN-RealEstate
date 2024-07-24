import express from 'express';
import { test, updateUserInfo } from '../controllers/user.controllers.js';
import { VerifyToken } from '../Utiles/verifyUser.js';

const router = express.Router();

router.get('/test',test)
router.post('/update/:id',VerifyToken,updateUserInfo)

export default router;