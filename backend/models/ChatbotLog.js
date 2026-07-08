import mongoose from 'mongoose';

const chatbotLogSchema = new mongoose.Schema({
  user_question: {
    type: String,
    required: true,
    trim: true
  },
  bot_response: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add virtual field to map _id to chat_id for ERD alignment
chatbotLogSchema.virtual('chat_id').get(function() {
  return this._id;
});

chatbotLogSchema.set('toJSON', { virtuals: true });
chatbotLogSchema.set('toObject', { virtuals: true });

export default mongoose.model('ChatbotLog', chatbotLogSchema);
