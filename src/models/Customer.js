import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const customerSchema = new mongoose.Schema(
	{
		email: { type: String },
		phone: { type: String },
		name: { type: String },
		status: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

customerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const customer = mongoose.model('customer', customerSchema);

export default customer;
