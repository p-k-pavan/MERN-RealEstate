import express from 'express';
import { deleteUser, test, updateUserInfo } from '../controllers/user.controllers.js';
import { VerifyToken } from '../Utiles/verifyUser.js';

const router = express.Router();

router.get('/test',test)
router.post('/update/:id',VerifyToken,updateUserInfo)
router.delete('/delete/:id',VerifyToken,deleteUser)

export default router;