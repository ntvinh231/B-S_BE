import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
	createProject,
	deleteProject,
	getAllProject,
	getProjetById,
	updateProject,
} from '../controllers/projectController.js';
import uploader from '../middleware/uploader.js';

const router = express.Router();

router.post('/create', isLoggedIn, uploader.array('images', 10), createProject);
router.get('/getAll', getAllProject);
router.get('/getById/:id', getProjetById);
router.patch('/update', isLoggedIn, updateProject);
router.delete('/delete', isLoggedIn, deleteProject);
export default router;
