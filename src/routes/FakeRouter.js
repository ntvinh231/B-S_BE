import express from 'express';
import { signUp } from '../controllers/authController.js';

const router = express.Router();

router.get('/final-register/:token', (req, res) => {
	const token = req.params.token;
	req.body.token = token;
	signUp(req, res);
});

export default router;
