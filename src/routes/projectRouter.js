import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import { createProject, deleteProject, getAllProject, updateProject } from '../controllers/projectController.js';
import uploader from '../middleware/uploader.js';

const router = express.Router();

router.post('/create', isLoggedIn, uploader.array('image', 10), createProject);
router.get('/getAll', isLoggedIn, getAllProject);
router.patch('/update', isLoggedIn, updateProject);
router.delete('/delete', isLoggedIn, deleteProject);
export default router;
