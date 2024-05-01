import mongoose from 'mongoose';
const consignmentContractSchema = new mongoose.Schema(
	{
		serviceCost: { type: Number },
		expires: { type: Date },
		propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
		customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
	},
	{
		timestamps: true,
	}
);
consignmentContractSchema.virtual('expirationDate').get(function () {
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

consignmentContractSchema.virtual('nameCustomer', {
	ref: 'Customer',
	localField: 'customerId',
	foreignField: '_id',
	justOne: true,
});

consignmentContractSchema.virtual('nameProperty', {
	ref: 'Project',
	localField: 'propertyId',
	foreignField: '_id',
	justOne: true,
});

consignmentContractSchema.set('toObject', { getters: true, virtuals: true });
consignmentContractSchema.set('toJSON', { getters: true, virtuals: true });
const consignmentContract = mongoose.model('ConsignmentContract', consignmentContractSchema);

export default consignmentContract;
