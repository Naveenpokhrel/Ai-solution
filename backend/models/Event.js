import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  event_date: {
    type: Date
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ""
  },
  isPromotional: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Pre-save sync for field aliases
eventSchema.pre('save', async function(next) {
  try {
    if (this.isPromotional) {
      await mongoose.model('Event').updateMany(
        { _id: { $ne: this._id } },
        { $set: { isPromotional: false } }
      );
    }
  } catch (err) {
    return next(err);
  }

  if (this.title && !this.tittle) {
    this.tittle = this.title;
  } else if (this.tittle && !this.title) {
    this.title = this.tittle;
  }

  if (this.date && !this.event_date) {
    this.event_date = this.date;
  } else if (this.event_date && !this.date) {
    this.date = this.event_date;
  }
  next();
});

// Add virtual field to map _id to event_id for ERD alignment
eventSchema.virtual('event_id').get(function() {
  return this._id;
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

export default mongoose.model('Event', eventSchema);
