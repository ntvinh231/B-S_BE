import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import httpError from 'http-errors';
import connection from './src/database/connection.js';
import userRouter from './src/routes/userRouter.js';
import fakeRouteRouter from './src/routes/FakeRouter.js';
import customerRouter from './src/routes/customerRouter.js';
import projectRouter from './src/routes/projectRouter.js';
import typeRouter from './src/routes/typeRouter.js';
import depositContract from './src/routes/depositContract.js';

const app = express();

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true, //access-control-allow-credentials:true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());

dotenv.config();

const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Max-Age', '1800');
	res.setHeader('Access-Control-Allow-Headers', 'content-type');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
});

//config file upload

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
app.use('/api/type', typeRouter);
app.use('/api/customer', customerRouter);
app.use('/api/deposit-contract', depositContract);
app.use('/', fakeRouteRouter);
// 404 handler and pass to error handler
app.all('*', (req, res, next) => {
	return next(httpError(404, `Can't find ${req.originalUrl} on this server!`));
});

(async () => {
	try {
		// test connection
		await connection();
		app.listen(port, hostname, () => {
			console.log('ok port', port);
		});
	} catch (error) {
		console.log('>>>Error connec to DB:', error);
	}
})();
