import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customer_name: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  reviewText: {
    type: String,
    required: true,
    trim: true
  },
  feedback_text: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  submitted_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Approved",
    trim: true
  }
}, { timestamps: true });

// Pre-save sync for field aliases
testimonialSchema.pre('save', function(next) {
  if (this.customerName && !this.customer_name) {
    this.customer_name = this.customerName;
  } else if (this.customer_name && !this.customerName) {
    this.customerName = this.customer_name;
  }

  if (this.companyName && !this.company) {
    this.company = this.companyName;
  } else if (this.company && !this.companyName) {
    this.companyName = this.company;
  }

  if (this.reviewText && !this.feedback_text) {
    this.feedback_text = this.reviewText;
  } else if (this.feedback_text && !this.reviewText) {
    this.reviewText = this.feedback_text;
  }
  next();
});

// Add virtual field to map _id to feedback_id for ERD alignment
testimonialSchema.virtual('feedback_id').get(function() {
  return this._id;
});

testimonialSchema.set('toJSON', { virtuals: true });
testimonialSchema.set('toObject', { virtuals: true });

export default mongoose.model('Testimonial', testimonialSchema);
