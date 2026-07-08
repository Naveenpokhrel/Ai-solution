import mongoose from 'mongoose';

const enquiryReportSchema = new mongoose.Schema({
  enquiry_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry',
    required: true
  },
  report_date: {
    type: Date,
    default: Date.now
  },
  inquiry_count: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Add virtual field to map _id to report_id for ERD alignment
enquiryReportSchema.virtual('report_id').get(function() {
  return this._id;
});

enquiryReportSchema.set('toJSON', { virtuals: true });
enquiryReportSchema.set('toObject', { virtuals: true });

export default mongoose.model('EnquiryReport', enquiryReportSchema);
