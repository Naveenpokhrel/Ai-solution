import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
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
  }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
