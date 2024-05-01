import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
	createTransferContract,
	deleteTransfer,
	getAllTransferContract,
	getTransferContractById,
	getTransferContractByPropertyId,
} from '../controllers/transferContractController.js';

const router = express.Router();

router.post('/create', isLoggedIn, createTransferContract);
router.get('/getAll', isLoggedIn, getAllTransferContract);
router.post('/getById', isLoggedIn, getTransferContractById);
router.post('/getByPropertyId', isLoggedIn, getTransferContractByPropertyId);
router.delete('/delete', isLoggedIn, deleteTransfer);

export default router;
