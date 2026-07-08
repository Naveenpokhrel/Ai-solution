import mongoose from 'mongoose';

const adminLoginLogSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  captcha_status: {
    type: String,
    required: true,
    default: "Passed"
  },
  login_time: {
    type: Date,
    default: Date.now
  },
  ip_address: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Add virtual field to map _id to login_id for ERD alignment
adminLoginLogSchema.virtual('login_id').get(function() {
  return this._id;
});

adminLoginLogSchema.set('toJSON', { virtuals: true });
adminLoginLogSchema.set('toObject', { virtuals: true });

export default mongoose.model('AdminLoginLog', adminLoginLogSchema);
