import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  tittle: {
    type: String,
    trim: true
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solution'
  },
  industry: {
    type: String,
    default: "General",
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  clientName: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    trim: true
  },
  completion_date: {
    type: Date
  },
  details: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Pre-save sync for field aliases
projectSchema.pre('save', function(next) {
  if (this.title && !this.tittle) {
    this.tittle = this.title;
  } else if (this.tittle && !this.title) {
    this.title = this.tittle;
  }

  if (this.imageUrl && !this.image) {
    this.image = this.imageUrl;
  } else if (this.image && !this.imageUrl) {
    this.imageUrl = this.image;
  }

  if (this.date && !this.completion_date) {
    // Attempt to parse string date (e.g. "Q3 2025" or ISO) into Date object if possible,
    // or just leave it blank/defaulted if not formatable.
    try {
      const parsed = Date.parse(this.date);
      if (!isNaN(parsed)) {
        this.completion_date = new Date(parsed);
      }
    } catch (e) {}
  }
  next();
});

// Add virtual field to map _id to project_id for ERD alignment
projectSchema.virtual('project_id').get(function() {
  return this._id;
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

export default mongoose.model('Project', projectSchema);
