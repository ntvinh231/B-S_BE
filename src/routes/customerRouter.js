import express from 'express';
const router = express.Router();

import { createCustomer, getAllCustomer, updateCustomer } from '../controllers/customerController.js';

router.post('/create', createCustomer);
router.get('/getAll', getAllCustomer);
router.patch('/update/:id', updateCustomer);
router.patch('/final-register/:token', updateCustomer);

export default router;
