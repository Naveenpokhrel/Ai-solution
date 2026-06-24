import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
  details: {
    type: [String], // Array of service details or features
    default: []
  }
}, { timestamps: true });

export default mongoose.model('Solution', solutionSchema);
