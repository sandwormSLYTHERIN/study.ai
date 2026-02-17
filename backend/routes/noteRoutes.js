const express = require('express');
const router = express.Router();
const {
  uploadNote,
  getNotes,
  getNoteById,
  deleteNote,
  updateNote
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { handleUpload } = require('../middleware/uploadMiddleware');

/**
 * @route   POST /api/notes/upload
 * @desc    Upload a new note/study material
 * @access  Private
 */
router.post('/upload', protect, handleUpload, uploadNote);

/**
 * @route   GET /api/notes
 * @desc    Get all notes for logged-in user (with optional filters)
 * @access  Private
 * @query   ?subject=Math&tags=algebra,geometry&search=calculus
 */
router.get('/', protect, getNotes);

/**
 * @route   GET /api/notes/:id
 * @desc    Get single note by ID
 * @access  Private
 */
router.get('/:id', protect, getNoteById);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update note details
 * @access  Private
 */
router.put('/:id', protect, updateNote);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 * @access  Private
 */
router.delete('/:id', protect, deleteNote);

module.exports = router;