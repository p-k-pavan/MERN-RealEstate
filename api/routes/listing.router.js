import express from 'express'
import { createListing } from '../controllers/listing.controller.js';
import { VerifyToken } from '../Utiles/verifyUser.js';

const router = express.Router();

router.post('/create',VerifyToken,createListing);

export default router;