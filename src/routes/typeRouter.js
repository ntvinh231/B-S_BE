import express from 'express';
import { createType, deleteType, getAllType, getTypeById, updateType } from '../controllers/typeController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
const router = express.Router();

router.post('/create', isLoggedIn, createType);
router.get('/getAll', getAllType);
router.get('/getById/:id', isLoggedIn, getTypeById);
router.patch('/update', isLoggedIn, updateType);
router.delete('/delete', isLoggedIn, deleteType);
export default router;
