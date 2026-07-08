import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  caption: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true // e.g. "Events", "Office", "Projects"
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: false // Optional in case of general office images
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  upload_date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save sync for field aliases
gallerySchema.pre('save', function(next) {
  if (this.imageUrl && !this.image) {
    this.image = this.imageUrl;
  } else if (this.image && !this.imageUrl) {
    this.imageUrl = this.image;
  }

  if (this.eventId && !this.event_id) {
    this.event_id = this.eventId;
  } else if (this.event_id && !this.eventId) {
    this.eventId = this.event_id;
  }
  next();
});

// Add virtual field to map _id to gallery_id for ERD alignment
gallerySchema.virtual('gallery_id').get(function() {
  return this._id;
});

gallerySchema.set('toJSON', { virtuals: true });
gallerySchema.set('toObject', { virtuals: true });

export default mongoose.model('Gallery', gallerySchema);
