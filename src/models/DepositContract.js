import mongoose from 'mongoose';

const depositContractSchema = new mongoose.Schema(
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

depositContractSchema.virtual('expirationDate').get(function () {
	const timeDifferenceInSeconds = Math.floor((this.expires - this.createdAt) / 1000);
	const daysLeft = Math.floor(timeDifferenceInSeconds / (24 * 3600));
	const hoursLeft = Math.floor((timeDifferenceInSeconds % (24 * 3600)) / 3600);
	const minutesLeft = Math.floor((timeDifferenceInSeconds % 3600) / 60);
	return {
		daysLeft: daysLeft > 0 ? daysLeft : 0,
		hoursLeft: hoursLeft > 0 ? hoursLeft : 0,
		minutesLeft: minutesLeft > 0 ? minutesLeft : 0,
	};
});

depositContractSchema.set('toObject', { getters: true });
depositContractSchema.set('toJSON', { getters: true });
const depositContract = mongoose.model('depositContract', depositContractSchema);

export default depositContract;
