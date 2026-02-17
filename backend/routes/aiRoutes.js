const express = require('express');
const router = express.Router();
const {
  summarizeVideo,
  getSummaries,
  getSummaryById,
  deleteSummary,
  testSummarize,
  analyzeDocument,
  generateStudyGuide
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/ai/summarize
 * @desc    Summarize YouTube video with Mistral AI
 * @access  Private
 */
router.post('/summarize', protect, summarizeVideo);

/**
 * @route   POST /api/ai/test-summarize
 * @desc    Test AI summarization with sample transcript (no YouTube required)
 * @access  Private
 */
router.post('/test-summarize', protect, testSummarize);

/**
 * @route   GET /api/ai/summaries
 * @desc    Get all video summaries for logged-in user
 * @access  Private
 * @query   ?difficulty=beginner&topics=math,science&search=calculus
 */
router.get('/summaries', protect, getSummaries);

/**
 * @route   GET /api/ai/summaries/:id
 * @desc    Get single video summary by ID
 * @access  Private
 */
router.get('/summaries/:id', protect, getSummaryById);

/**
 * @route   DELETE /api/ai/summaries/:id
 * @desc    Delete a video summary
 * @access  Private
 */
router.delete('/summaries/:id', protect, deleteSummary);

/**
 * @route   POST /api/ai/analyze-document/:noteId
 * @desc    Ask AI questions about an uploaded document
 * @access  Private
 * @body    { "question": "Your question here" }
 */
router.post('/analyze-document/:noteId', protect, analyzeDocument);

/**
 * @route   POST /api/ai/study-guide/:noteId
 * @desc    Generate AI study guide for a document
 * @access  Private
 */
router.post('/study-guide/:noteId', protect, generateStudyGuide);

module.exports = router;