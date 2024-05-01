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

const getPublicIdFromUrl = (url) => {
	const parts = url.split('/');

	const filename = parts.pop();

	const publicId = filename.slice(0, filename.lastIndexOf('.'));
	return publicId;
};

const isAddressComplete = (address) => {
	return address.province.provinceCode && address.district.districtCode && address.ward.wardCode;
};
export const updateProject = async (req, res, next) => {
	const files = req.files;
	try {
		const { id } = req.body;
		const { name, status, acreage, price, address, typeId } = req.body;

		const existingProject = await Project.findById(id);
		if (!existingProject) {
			if (files) {
				files.forEach((file) => cloudinary.uploader.destroy(file.filename));
			}
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'No property found to update..',
			});
		}

		if (!isAddressComplete(address)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Please complete the updated address.',
			});
		}

		// Xóa các ảnh cũ từ cloudinary
		await Promise.all(
			existingProject.images.map(async (imagePath) => {
				await cloudinary.uploader.destroy(getPublicIdFromUrl(imagePath));
			})
		);

		if (name) existingProject.name = name;
		if (status) existingProject.status = status;
		if (acreage) existingProject.acreage = acreage;
		if (price) existingProject.price = price;
		if (address) existingProject.address = address;
		if (typeId) existingProject.typeId = typeId;

		// Thêm ảnh mới sau khi xóa ảnh cũ
		if (files && files.length) {
			const newImages = files.map((file) => file.path);
			existingProject.images = newImages;
		}

		await existingProject.save();

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Cập nhật dự án thành công.',
			data: existingProject,
		});
	} catch (error) {
		console.error(error);
		if (files) {
			files.forEach((file) => cloudinary.uploader.destroy(file.filename));
		}
		return next(httpError(400, error));
	}
};

export const getAllProject = async (req, res, next) => {
	try {
		const { provinceCode, districtCode, wardCode, name, price, typeId, status } = req.query;

		const filter = {};
		// Tìm kiếm theo typeId
		if (typeId) {
			filter.typeId = typeId;
		}

		// Tìm kiếm theo status
		if (status) {
			filter.status = status;
		}

		// Tìm kiếm theo tỉnh/thành phố
		if (provinceCode) {
			filter['address.province.provinceCode'] = parseInt(provinceCode);
		}

		// Tìm kiếm theo quận/huyện
		if (districtCode) {
			filter['address.district.districtCode'] = parseInt(districtCode);
		}

		// Tìm kiếm theo xã/phường
		if (wardCode) {
			filter['address.ward.wardCode'] = parseInt(wardCode);
		}

		if (name) {
			filter.name = { $regex: new RegExp(name, 'i') };
		}

		if (price) {
			const match = price.match(/^(gt|lt|gte|lte)_(\d+)$/);
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

		const projects = await Project.find(filter)
			.populate({
				path: 'typeName',
				select: 'name -_id',
				options: { lean: true },
			})
			.then((projects) =>
				projects.map((project) => {
					return { ...project.toObject(), typeName: project.typeName.name };
				})
			);
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: projects,
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
