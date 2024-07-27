import express from 'express'
import { createListing, deleteListing, updateListing } from '../controllers/listing.controller.js';
import { VerifyToken } from '../Utiles/verifyUser.js';

const router = express.Router();

router.post('/create',VerifyToken,createListing);
router.delete('/delete/:id',VerifyToken,deleteListing)
router.post('/update/:id',VerifyToken,updateListing)
export default router;