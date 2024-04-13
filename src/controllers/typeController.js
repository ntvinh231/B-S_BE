import Type from '../models/Type.js';
import apq from 'api-query-params';

export const createType = async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Vui lòng điền đầy đủ thông tin.',
			});
		}

		const checkTypeName = await Type.findOne({ name });
		if (checkTypeName) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Đã tồn tại loại hình bất động sản này.',
			});
		}
		const newType = new Type({ name });
		await newType.save();
		return res.status(200).json({
			statusCode: 201,
			statusMessage: 'success',
			message: 'Thêm thành công loại hình bất động sản',
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getAllType = async (req, res, next) => {
	const { filter, limit, sort } = apq(req.query);

	if (filter.name) {
		filter.name = { $regex: new RegExp(filter.name, 'i') };
	}

	const type = await Type.find(filter);
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: type,
	});
};

export const updateType = async (req, res, next) => {
	try {
		const { id, name } = req.body;
		const type = await Type.findById(id);
		if (!type) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Không tìm thấy loại hình bất động sản này.',
			});
		}

		const updateType = await Type.findByIdAndUpdate(
			id,
			{ name },
			{
				new: true,
			}
		);

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Sửa thành công tên loại hình bất động sản.',
			data: updateType,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Không thể sửa.',
		});
	}
};

export const deleteType = async (req, res, next) => {
	try {
		const { id } = req.body;
		const type = await Type.findById(id);
		if (!type) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Không tìm thấy loại hình bất động sản này.',
			});
		}

		const result = await Type.deleteOne({ _id: id });

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Xóa thành công tên loại hình bất động sản.',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Không thể xóa.',
		});
	}
};
