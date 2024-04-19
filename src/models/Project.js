import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
	{
		name: { type: String },
		state: { type: Boolean },
		acreage: { type: String },
		price: { type: Number },
		image: { type: Array },
		description: { type: String },
		address: { type: String },
		typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
	},
	{
		timestamps: true,
	}
);

const project = mongoose.model('project', projectSchema);

export default project;
