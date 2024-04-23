import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const customerSchema = new mongoose.Schema(
	{
		email: { type: String },
		phone: { type: String },
		name: { type: String },
		subject: { type: String },
		message: { type: String },
		status: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

customerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
