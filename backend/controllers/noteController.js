const Note = require('../models/Note');
const cloudinary = require('../config/cloudinary');

/**
 * @desc    Upload a new note/study material
 * @route   POST /api/notes/upload
 * @access  Private
 */
const uploadNote = async (req, res) => {
  try {
    const { title, description, tags, subject, isPublic } = req.body;

    // Check if file was uploaded (handled by uploadMiddleware)
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // File info from multer + cloudinary
    const { path: fileUrl, filename: cloudinaryPublicId } = req.file;

    // Determine file type
    const fileType = req.file.mimetype.includes('pdf') 
      ? 'pdf' 
      : req.file.mimetype.includes('image') 
      ? 'image' 
      : 'document';

    // Create note
    const note = await Note.create({
      title,
      description: description || '',
      fileUrl,
      fileType,
      cloudinaryPublicId,
      fileSize: req.file.size,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      subject: subject || '',
      user: req.user._id,
      isPublic: isPublic === 'true' || false
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      note
    });

  } catch (error) {
    console.error('Upload note error:', error);
    res.status(500).json({ 
      message: 'Failed to upload note',
      error: error.message 
    });
  }
};

/**
 * @desc    Get all notes for logged-in user
 * @route   GET /api/notes
 * @access  Private
 */
const getNotes = async (req, res) => {
  try {
    const { subject, tags, search } = req.query;

    // Build query
    let query = { user: req.user._id };

    if (subject) {
      query.subject = subject;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'username email');

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve notes',
      error: error.message 
    });
  }
};

/**
 * @desc    Get single note by ID
 * @route   GET /api/notes/:id
 * @access  Private
 */
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('user', 'username email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note or if note is public
    if (note.user._id.toString() !== req.user._id.toString() && !note.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }

    res.status(200).json({
      success: true,
      note
    });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve note',
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(note.cloudinaryPublicId);

    // Delete from database
    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      message: 'Failed to delete note',
      error: error.message 
    });
  }
};

/**
 * @desc    Update note details (not file)
 * @route   PUT /api/notes/:id
 * @access  Private
 */
const updateNote = async (req, res) => {
  try {
    const { title, description, tags, subject, isPublic } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    // Update fields
    note.title = title || note.title;
    note.description = description || note.description;
    note.subject = subject || note.subject;
    note.isPublic = isPublic !== undefined ? isPublic : note.isPublic;
    
    if (tags) {
      note.tags = tags.split(',').map(tag => tag.trim());
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ 
      message: 'Failed to update note',
      error: error.message 
    });
  }
};

module.exports = {
  uploadNote,
  getNotes,
  getNoteById,
  deleteNote,
  updateNote
};