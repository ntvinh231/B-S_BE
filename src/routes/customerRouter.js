import express from 'express';
const router = express.Router();

import { createCustomer, deleteCustomer, getAllCustomer, updateCustomer } from '../controllers/customerController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

router.post('/create', createCustomer);
router.get('/getAll', getAllCustomer);
router.patch('/update/:id', updateCustomer);
router.patch('/final-register/:token', updateCustomer);
router.delete('/delete', isLoggedIn, deleteCustomer);

export default router;
