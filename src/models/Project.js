import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
	{
		name: { type: String },
		price: { type: Number },
		typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
		status: { type: String },
		address: { type: String },
		acreage: { type: String },
		description: { type: String },
		images: { type: Array },
	},
	{
		timestamps: true,
	}
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
