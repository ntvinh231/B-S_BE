import Customer from '../models/Customer.js';
import httpError from 'http-errors';
import apq from 'api-query-params';

export const createCustomer = async (req, res, next) => {
	try {
		const { email, phone, name } = req.body;

		if (!email || !phone || !name) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Vui lòng điền đầy đủ thông tin.',
			});
		}

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailRegex.test(email)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Email không hợp lệ.Vui lòng nhập email hợp lệ',
			});
		}

		// const phoneRegex = /^\+84[0-9]+$/;
		const phoneRegex = /^[0-9]+$/;
		if (!phoneRegex.test(phone)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Số điện thoại không hợp lệ.Vui lòng nhập số điện thoại hợp lệ',
			});
		}
		//else {
		// 	if (phone.startsWith('0')) {
		// 		phone = '+84' + phone.slice(1);
		// 	}
		// }

		if (name.length < 3 || name.length > 30) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tên không hợp lệ. Tên phải có từ 3 đến 30 ký tự.',
			});
		}

		const newCustomer = new Customer(req.body);
		await newCustomer.save();
		return res.status(200).json({
			statusCode: 201,
			statusMessage: 'success',
			message: 'Thêm thành công thông tin tư vấn',
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getAllCustomer = async (req, res, next) => {
	const { filter, limit, sort } = apq(req.query);

	if (filter.email) {
		filter.email = { $regex: new RegExp(filter.email, 'i') };
	}
	if (filter.phone) {
		filter.phone = { $regex: new RegExp(filter.phone, 'i') };
	}

	const customer = await Customer.find(filter);
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: customer,
	});
};

export const updateCustomer = async (req, res, next) => {
	const id = req.params.id;
	if (!id) {
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'failed',
			message: 'The Customer ID is required',
		});
	}

	const checkCustomer = await Customer.findOne({ _id: id });
	if (!checkCustomer) {
		return res.status(404).json({
			statusCode: 404,
			statusMessage: 'failed',
			message: 'Customer không tồn tại',
		});
	}

	if (!(typeof req.body.status === 'boolean' || req.body.status === 'true' || req.body.status === 'false')) {
		return res.status(400).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Chỉ có thể là true hoặc false',
		});
	}
	let result = await Customer.findByIdAndUpdate(
		id,
		{
			$set: {
				status: req.body.status,
			},
		},
		{
			new: true,
			runValidators: true,
		}
	);
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: result,
	});
};
