import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
	createConsignmentContract,
	deleteConsignment,
	getAllConsignmentContract,
	getConsignmentByPropertyId,
	getConsignmentContractById,
} from '../controllers/consignmentContractController.js';

const router = express.Router();

router.post('/create', isLoggedIn, createConsignmentContract);
router.get('/getAll', isLoggedIn, getAllConsignmentContract);
router.post('/getById', isLoggedIn, getConsignmentContractById);
router.post('/getByPropertyId', isLoggedIn, getConsignmentByPropertyId);
router.delete('/delete', isLoggedIn, deleteConsignment);
// router.patch('/update/:id', updateCustomer);

export default router;
