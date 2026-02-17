const mongoose = require('mongoose');

const videoSummarySchema = new mongoose.Schema({
  youtubeUrl: {
    type: String,
    required: [true, 'YouTube URL is required'],
    trim: true
  },
  videoId: {
    type: String,
    required: true,
    trim: true
  },
  videoTitle: {
    type: String,
    trim: true
  },
  transcript: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keyPoints: [{
    type: String
  }],
  expectedQuestions: [{
    question: {
      type: String,
      required: true
    },
    suggestedAnswer: {
      type: String
    }
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  estimatedStudyTime: {
    type: Number, // in minutes
  },
  topics: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
videoSummarySchema.index({ user: 1, createdAt: -1 });
videoSummarySchema.index({ videoId: 1 });
videoSummarySchema.index({ topics: 1 });

const VideoSummary = mongoose.model('VideoSummary', videoSummarySchema);

module.exports = VideoSummary;