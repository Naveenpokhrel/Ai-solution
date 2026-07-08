import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  company_name: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  job_title: {
    type: String,
    trim: true
  },
  jobDetails: {
    type: String,
    required: true,
    trim: true
  },
  job_description: {
    type: String,
    trim: true
  },
  submitted_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Pending",
    trim: true
  }
}, { timestamps: true });

// Pre-save sync for field aliases
inquirySchema.pre('save', function(next) {
  if (this.companyName && !this.company_name) {
    this.company_name = this.companyName;
  } else if (this.company_name && !this.companyName) {
    this.companyName = this.company_name;
  }

  if (this.jobTitle && !this.job_title) {
    this.job_title = this.jobTitle;
  } else if (this.job_title && !this.jobTitle) {
    this.jobTitle = this.job_title;
  }

  if (this.jobDetails && !this.job_description) {
    this.job_description = this.jobDetails;
  } else if (this.job_description && !this.jobDetails) {
    this.jobDetails = this.job_description;
  }
  next();
});

// Add virtual field to map _id to enquiry_id for ERD alignment
inquirySchema.virtual('enquiry_id').get(function() {
  return this._id;
});

inquirySchema.set('toJSON', { virtuals: true });
inquirySchema.set('toObject', { virtuals: true });

export default mongoose.model('Inquiry', inquirySchema);
