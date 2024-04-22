import httpError from 'http-errors';
import DepositContract from '../models/DepositContract.js';
import apq from 'api-query-params';

export const createDepositContract = async (req, res, next) => {
	try {
		const existCheck = DepositContract.findOne({
			propertyId: req.body.propertyId,
		});

		const expiresCheck = new Date(req.body.expires) > Date.now();

		if (!expiresCheck) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Thời hạn hợp đồng phải lớn hơn thời gian lập hợp đồng',
			});
		}
		const depositContract = new DepositContract(req.body);
		await depositContract.save();
		return res.status(200).json({
			statusCode: 201,
			statusMessage: 'success',
			message: 'Tạo thành công hợp đồng đặt cọc',
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getAllDepositContract = async (req, res, next) => {
	const { filter, limit, sort } = apq(req.query);

	if (typeof filter.status !== 'boolean') delete filter.status;

	const result = await DepositContract.find(filter);
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: result,
	});
};
