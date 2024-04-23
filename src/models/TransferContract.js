import mongoose from 'mongoose';

const transferContractSchema = new mongoose.Schema(
	{
		status: { type: Boolean, default: false },
		value: { type: Number },
		expires: { type: Date },
		propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
		customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
	},
	{
		timestamps: true,
	}
);
transferContractSchema.virtual('expirationDate').get(function () {
	const now = new Date();
	const timeDifferenceInSeconds = Math.floor((this.expires - now) / 1000);
	const daysLeft = Math.floor(timeDifferenceInSeconds / (24 * 3600));
	const hoursLeft = Math.floor((timeDifferenceInSeconds % (24 * 3600)) / 3600);
	const minutesLeft = Math.floor((timeDifferenceInSeconds % 3600) / 60);
	return {
		daysLeft: daysLeft > 0 ? daysLeft : 0,
		hoursLeft: hoursLeft > 0 ? hoursLeft : 0,
		minutesLeft: minutesLeft > 0 ? minutesLeft : 0,
	};
});

transferContractSchema.virtual('nameCustomer', {
	ref: 'Customer',
	localField: 'customerId',
	foreignField: '_id',
	justOne: true,
});

transferContractSchema.virtual('nameProperty', {
	ref: 'Project',
	localField: 'propertyId',
	foreignField: '_id',
	justOne: true,
});

transferContractSchema.set('toObject', { getters: true, virtuals: true });
transferContractSchema.set('toJSON', { getters: true, virtuals: true });
const transferContract = mongoose.model('transferContract', transferContractSchema);

export default transferContract;
