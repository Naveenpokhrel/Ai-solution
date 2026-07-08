import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Add virtual field to map _id to article_id for ERD alignment
articleSchema.virtual('article_id').get(function() {
  return this._id;
});

articleSchema.set('toJSON', { virtuals: true });
articleSchema.set('toObject', { virtuals: true });

export default mongoose.model('Article', articleSchema);
