import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
	createTransferContract,
	getAllTransferContract,
	getTransferContractById,
	getTransferContractByPropertyId,
} from '../controllers/transferContractController.js';

const router = express.Router();

router.post('/create', isLoggedIn, createTransferContract);
router.get('/getAll', isLoggedIn, getAllTransferContract);
router.post('/getById', isLoggedIn, getTransferContractById);
router.post('/getByPropertyId', isLoggedIn, getTransferContractByPropertyId);
// router.patch('/update/:id', updateCustomer);
// router.patch('/final-register/:token', updateCustomer);

export default router;
