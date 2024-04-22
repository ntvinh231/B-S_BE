import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import { createDepositContract, getAllDepositContract } from '../controllers/depositContractController.js';
const router = express.Router();

router.post('/create', isLoggedIn, createDepositContract);
router.get('/getAll', isLoggedIn, getAllDepositContract);
// router.patch('/update/:id', updateCustomer);
// router.patch('/final-register/:token', updateCustomer);

export default router;