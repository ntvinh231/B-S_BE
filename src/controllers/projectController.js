import Project from '../models/Project.js';
import apq from 'api-query-params';
import { v2 as cloudinary } from 'cloudinary';
import httpError from 'http-errors';

export const createProject = async (req, res, next) => {
	let fileData;
	try {
		const fileData = req.files;

		const { name, status, acreage, price, address, typeId } = req.body;

		if (!status || !acreage || !price || !fileData || !address || !typeId) {
			if (fileData) {
				fileData.forEach((file) => cloudinary.uploader.destroy(file.filename));
			}
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Vui lòng điền đầy đủ thông tin.',
			});
		}

		const checkProjectName = await Project.findOne({ name });
		if (checkProjectName) {
			return res.status(400).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Tên bất động sản này đã tồn tại.',
			});
		}

		const newProject = new Project({
			name,
			status,
			acreage,
			price,
			address,
			typeId,
			images: fileData.map((file) => {
				return file.path;
			}),
		});

		await newProject.save();

		return res.status(201).json({
			statusCode: 201,
			statusMessage: 'success',
			message: 'Thêm thành công loại hình bất động sản',
			data: newProject,
		});
	} catch (error) {
		console.log(error);
		if (fileData) {
			fileData.forEach((file) => cloudinary.uploader.destroy(file.filename));
		}
		return next(httpError(400, error));
	}
};

export const getAllProject = async (req, res, next) => {
	try {
		const { filter, limit, sort } = apq(req.query);

		if (filter.name) {
			filter.name = { $regex: new RegExp(filter.name, 'i') };
		}

		if (filter.price) {
			const match = filter.price.match(/^(gt|lt|gte|lte)_(\d+)$/); // Phân tích giá trị
			if (match) {
				const operator = match[1];
				const value = parseInt(match[2]);
				if (operator === 'gt') {
					filter.price = { $gt: value }; // Lớn hơn
				} else if (operator === 'lt') {
					filter.price = { $lt: value }; // Nhỏ hơn
				} else if (operator === 'gte') {
					filter.price = { $gte: value }; // Lớn hơn hoặc bằng
				} else if (operator === 'lte') {
					filter.price = { $lte: value }; // Nhỏ hơn hoặc bằng
				} else {
					filter.price = { $gt: value }; // không có mặc định là lớn hơn
				}
			}
		}

		const project = await Project.find(filter);
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: project,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: error.message,
		});
	}
};
export const getProjetById = async (req, res, next) => {
	try {
		const project = await Project.findById(req.params.id);
		if (!project) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Not found',
			});
		}
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: project,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: error.message,
		});
	}
};

export const updateProject = async (req, res, next) => {
	try {
		const { id } = req.body;
		const project = await Project.findById(id);
		if (!project) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Không tìm thấy bất động sản này.',
			});
		}

		const updateProject = await Project.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Sửa thành công bất động sản.',
			data: updateProject,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: error.message,
		});
	}
};

export const deleteProject = async (req, res, next) => {
	try {
		const { id } = req.body;
		const project = await Project.findById(id);
		if (!project) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Không tìm thấy bất động sản này.',
			});
		}

		const result = await Project.deleteOne({ _id: id });

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Xóa thành công bất động sản.',
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
