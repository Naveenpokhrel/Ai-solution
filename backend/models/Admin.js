import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  Full_name: {
    type: String,
    default: "Admin User",
    trim: true
  },
  full_name: {
    type: String,
    default: "Admin User",
    trim: true
  },
  role: {
    type: String,
    default: "Admin",
    trim: true
  }
}, { timestamps: true });

// Add virtual field to map _id to admin_id for ERD alignment
adminSchema.virtual('admin_id').get(function() {
  return this._id;
});

adminSchema.set('toJSON', { virtuals: true });
adminSchema.set('toObject', { virtuals: true });

// Hash password and sync full_name before saving
adminSchema.pre('save', async function (next) {
  if (this.full_name && !this.Full_name) {
    this.Full_name = this.full_name;
  } else if (this.Full_name && !this.full_name) {
    this.full_name = this.Full_name;
  }

  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Admin', adminSchema);
