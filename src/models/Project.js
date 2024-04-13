import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
	{
		state: { type: String },
		acreage: { type: String },
		price: { type: String },
		image: { type: String },
		description: { type: String },
		address: { type: String },
		typeId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
		customerId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Type' }],
	},
	{
		timestamps: true,
	}
);

const project = mongoose.model('project', projectSchema);

export default project;
