import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
	createDepositContract,
	deleteDeposit,
	getAllDepositContract,
	getDepositContractById,
	getDepositContractByPropertyId,
} from '../controllers/depositContractController.js';
const router = express.Router();

router.post('/create', isLoggedIn, createDepositContract);
router.get('/getAll', isLoggedIn, getAllDepositContract);
router.post('/getById', isLoggedIn, getDepositContractById);
router.post('/getByPropertyId', isLoggedIn, getDepositContractByPropertyId);
router.delete('/delete', isLoggedIn, deleteDeposit);

export default router;
