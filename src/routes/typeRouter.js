import express from 'express';
import { createType, deleteType, getAllType, updateType } from '../controllers/typeController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
const router = express.Router();

router.post('/create', isLoggedIn, createType);
router.get('/getAll', getAllType);
router.patch('/update', isLoggedIn, updateType);
router.delete('/delete', isLoggedIn, deleteType);
export default router;
