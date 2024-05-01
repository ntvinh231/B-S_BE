import httpError from 'http-errors';
import ConsignmentContract from '../models/ConsignmentContract.js';
import apq from 'api-query-params';

export const createConsignmentContract = async (req, res, next) => {
	try {
		const { serviceCost, expires, propertyId, customerId } = req.body;

		if (!serviceCost || !expires || !propertyId || !customerId) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Please complete all information',
			});
		}

		if (isNaN(serviceCost)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Value must be a number',
			});
		}

		const expiresDate = new Date(expires);
		expiresDate.setDate(expiresDate.getDate() + 1);
		expiresDate.setHours(0, 0, 0, 0);

		const consignmentContract = new ConsignmentContract({
			serviceCost,
			propertyId,
			customerId,
			expires: expiresDate,
		});
		await consignmentContract.save();
		return res.status(200).json({
			statusCode: 201,
			statusMessage: 'success',
			message: 'Successfully created consignment contract',
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getConsignmentByPropertyId = async (req, res, next) => {
	const { id } = req.body;

	const result = await ConsignmentContract.findOne({ propertyId: id });
	if (!result) {
		return res.status(200).json({
			statusCode: 404,
			statusMessage: 'failed',
			message: 'Consignment contract not found',
		});
	}
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: result,
	});
};

export const getAllConsignmentContract = async (req, res, next) => {
	const { filter, limit, sort } = apq(req.query);

	if (typeof filter.status !== 'boolean') delete filter.status;

	try {
		const result = await ConsignmentContract.find(filter)
			.populate({
				path: 'customerId',
				select: 'name',
			})
			.populate({
				path: 'propertyId',
				select: 'name',
			});

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: result,
		});
	} catch (error) {
		console.error(error);
		return next(httpError(500, error));
	}
};

export const getConsignmentContractById = async (req, res, next) => {
	const { id } = req.body;

	const result = await ConsignmentContract.findOne({ _id: id })
		.populate({
			path: 'customerId',
			select: 'name',
		})
		.populate({
			path: 'propertyId',
			select: 'name',
		});
	if (!result) {
		return res.status(200).json({
			statusCode: 404,
			statusMessage: 'failed',
			message: 'Consignment contract not found',
		});
	}
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: result,
	});
};

export const deleteConsignment = async (req, res, next) => {
	try {
		const { id } = req.body;
		const consignment = await Project.findById(id);
		if (!consignment) {
			return res.status(200).json({
				statusCode: 404,
				statusMessage: 'failed',
				message: 'Not found Consignment.',
			});
		}

		const result = await ConsignmentContract.deleteOne({ _id: id });

		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			message: 'Delete Success.',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			statusCode: 400,
			statusMessage: 'failed',
			message: 'Delete failed.',
		});
	}
};
