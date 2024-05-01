import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
	{
		name: { type: String },
		price: { type: Number },
		typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
		status: { type: String },
		address: {
			province: {
				provinceCode: Number,
				provinceName: String,
			},
			district: {
				districtCode: Number,
				districtName: String,
			},
			ward: {
				wardCode: Number,
				wardName: String,
			},
		},
		acreage: { type: String },
		description: { type: String },
		images: { type: Array },
	},
	{
		timestamps: true,
	}
);

projectSchema.virtual('typeName', {
	ref: 'Type',
	localField: 'typeId',
	foreignField: '_id',
	justOne: true,
});

projectSchema.set('toObject', { getters: true, virtuals: true });
projectSchema.set('toJSON', { getters: true, virtuals: true });
const Project = mongoose.model('Project', projectSchema);

export default Project;
