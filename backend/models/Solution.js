import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  tittle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    trim: true // CSS class name or identifier
  },
  status: {
    type: String,
    required: true,
    default: "Active",
    trim: true
  },
  details: {
    type: [String], // Array of service details or features
    default: []
  }
}, { timestamps: true });

// Sync title and tittle before saving
solutionSchema.pre('save', function(next) {
  if (this.title && !this.tittle) {
    this.tittle = this.title;
  } else if (this.tittle && !this.title) {
    this.title = this.tittle;
  }
  next();
});

// Add virtual field to map _id to service_id for ERD alignment
solutionSchema.virtual('service_id').get(function() {
  return this._id;
});

solutionSchema.set('toJSON', { virtuals: true });
solutionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Solution', solutionSchema);
