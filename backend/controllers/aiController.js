const VideoSummary = require('../models/videoSummary');
const { generateSummary, generateQuestions } = require('../config/mistral');
const { fetchYouTubeTranscript } = require('../utils/youtubeTranscript');

/**
 * Extract YouTube video ID from URL
 */
const extractVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Fetch transcript using YouTube's internal API
 */
const fetchTranscript = async (videoId) => {
  try {
    // Try method 1: Direct API call
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
    const html = response.data;
    
    // Extract captions data from page
    const captionsMatch = html.match(/"captions":\s*({[^}]+})/);
    if (!captionsMatch) {
      throw new Error('No captions found');
    }

    // Method 2: Use subtitle download endpoint
    const timedTextUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`;
    const captionResponse = await axios.get(timedTextUrl);
    
    // Parse XML response
    const transcript = captionResponse.data
      .replace(/<[^>]*>/g, ' ') // Remove XML tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    
    return transcript;
  } catch (error) {
    throw new Error('Failed to fetch transcript');
  }
};

/**
 * @desc    Summarize YouTube video
 * @route   POST /api/ai/summarize
 * @access  Private
 */
const summarizeVideo = async (req, res) => {
  try {
    const { youtubeUrl, isPublic } = req.body;

    // Validation
    if (!youtubeUrl) {
      return res.status(400).json({ message: 'YouTube URL is required' });
    }

    // Extract video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    // Check if summary already exists for this user and video
    const existingSummary = await VideoSummary.findOne({ 
      videoId, 
      user: req.user._id 
    });

    if (existingSummary) {
      return res.status(200).json({
        success: true,
        message: 'Summary already exists',
        videoSummary: existingSummary,
        cached: true
      });
    }

    // Get transcript
    let transcript;
try {
  console.log('Fetching transcript...');
  transcript = await fetchYouTubeTranscript(videoId);
  console.log(`Transcript fetched: ${transcript.length} characters`);
} catch (error) {
  console.error('Transcript fetch error:', error.message);
  return res.status(400).json({ 
    message: 'Failed to fetch video transcript. Please ensure the video has English captions/subtitles enabled.',
    details: error.message
  });
}

    if (!transcript || transcript.length < 100) {
      return res.status(400).json({ 
        message: 'Transcript too short or unavailable for this video' 
      });
    }

    // Limit transcript size
    const maxTranscriptLength = 8000;
    const trimmedTranscript = transcript.length > maxTranscriptLength 
      ? transcript.substring(0, maxTranscriptLength) + '...' 
      : transcript;

    // Generate summary using Mistral AI
    const summaryData = await generateSummary(trimmedTranscript);

    // Generate questions
    const questions = await generateQuestions(trimmedTranscript, summaryData.summary);

    // Create video summary document
    const videoSummary = await VideoSummary.create({
      youtubeUrl,
      videoId,
      transcript: trimmedTranscript,
      summary: summaryData.summary,
      keyPoints: summaryData.keyPoints || [],
      expectedQuestions: questions,
      difficulty: summaryData.difficulty || 'intermediate',
      estimatedStudyTime: summaryData.estimatedStudyTime || 15,
      topics: summaryData.topics || [],
      user: req.user._id,
      isPublic: isPublic || false
    });

    res.status(201).json({
      success: true,
      message: 'Video summarized successfully',
      videoSummary,
      cached: false
    });

  } catch (error) {
    console.error('Video summarization error:', error);
    res.status(500).json({ 
      message: 'Failed to summarize video',
      error: error.message 
    });
  }
};

/**
 * @desc    Get all video summaries for logged-in user
 * @route   GET /api/ai/summaries
 * @access  Private
 */
const getSummaries = async (req, res) => {
  try {
    const { difficulty, topics, search } = req.query;

    // Build query
    let query = { user: req.user._id };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (topics) {
      query.topics = { $in: topics.split(',') };
    }

    if (search) {
      query.$or = [
        { summary: { $regex: search, $options: 'i' } },
        { videoTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const summaries = await VideoSummary.find(query)
      .sort({ createdAt: -1 })
      .select('-transcript'); // Exclude long transcript from list view

    res.status(200).json({
      success: true,
      count: summaries.length,
      summaries
    });

  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve summaries',
      error: error.message 
    });
  }
};

/**
 * @desc    Get single video summary by ID
 * @route   GET /api/ai/summaries/:id
 * @access  Private
 */
const getSummaryById = async (req, res) => {
  try {
    const summary = await VideoSummary.findById(req.params.id)
      .populate('user', 'name email');

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    // Check if user owns the summary or if it's public
    if (summary.user._id.toString() !== req.user._id.toString() && !summary.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this summary' });
    }

    res.status(200).json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve summary',
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a video summary
 * @route   DELETE /api/ai/summaries/:id
 * @access  Private
 */
const deleteSummary = async (req, res) => {
  try {
    const summary = await VideoSummary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    // Check if user owns the summary
    if (summary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this summary' });
    }

    await summary.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Summary deleted successfully'
    });

  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({ 
      message: 'Failed to delete summary',
      error: error.message 
    });
  }
};

/**
 * @desc    Test AI summarization with sample transcript
 * @route   POST /api/ai/test-summarize
 * @access  Private
 */
const testSummarize = async (req, res) => {
  try {
    const sampleTranscript = `
      Welcome to this introduction to machine learning. In this video, we'll cover the basics of supervised and unsupervised learning.
      Machine learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed.
      Supervised learning involves training a model on labeled data, where each example has an input and a corresponding output.
      Common supervised learning algorithms include linear regression, logistic regression, and decision trees.
      Unsupervised learning, on the other hand, works with unlabeled data and tries to find patterns or structure.
      Clustering and dimensionality reduction are examples of unsupervised learning techniques.
      Neural networks are powerful models inspired by the human brain, consisting of layers of interconnected nodes.
      Deep learning uses neural networks with many layers to solve complex problems like image recognition and natural language processing.
      To get started with machine learning, you'll need to understand basic statistics, linear algebra, and programming, especially Python.
      Popular libraries include scikit-learn for traditional machine learning and TensorFlow or PyTorch for deep learning.
    `;

    const summaryData = await generateSummary(sampleTranscript, 'Introduction to Machine Learning');
    const questions = await generateQuestions(sampleTranscript, summaryData.summary);

    res.status(200).json({
      success: true,
      summary: summaryData.summary,
      keyPoints: summaryData.keyPoints,
      expectedQuestions: questions,
      topics: summaryData.topics,
      difficulty: summaryData.difficulty,
      estimatedStudyTime: summaryData.estimatedStudyTime
    });

  } catch (error) {
    console.error('Test summarization error:', error);
    res.status(500).json({ 
      message: 'Failed to generate summary',
      error: error.message 
    });
  }
};

const Note = require('../models/Note');

/**
 * @desc    Analyze uploaded document with AI
 * @route   POST /api/ai/analyze-document/:noteId
 * @access  Private
 */
const analyzeDocument = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { question } = req.body;

    // Find the note
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this document' });
    }

    // For PDF analysis, we'll provide context about the document
    const documentContext = `
Document Information:
- Title: ${note.title}
- Subject: ${note.subject}
- Tags: ${note.tags.join(', ')}
- Description: ${note.description || 'No description'}
- File Type: ${note.fileType}
- File Size: ${(note.fileSize / 1024).toFixed(2)} KB
- Upload Date: ${note.createdAt.toDateString()}
    `;

    // Create prompt for AI
    const prompt = question 
      ? `${documentContext}\n\nUser Question: ${question}\n\nPlease provide a helpful answer based on this document information.`
      : `${documentContext}\n\nPlease provide:\n1. A brief summary of what this document likely contains based on its metadata\n2. Key topics it might cover\n3. Suggested questions someone studying this document might ask`;

    // Call AI
    const { callMistralAPI } = require('../config/mistral');
    const aiResponse = await callMistralAPI(prompt);

    res.status(200).json({
      success: true,
      document: {
        title: note.title,
        subject: note.subject,
        tags: note.tags,
        fileUrl: note.fileUrl
      },
      question: question || 'Document analysis',
      aiResponse
    });

  } catch (error) {
    console.error('Document analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze document',
      error: error.message 
    });
  }
};

/**
 * @desc    Get study suggestions for a document
 * @route   POST /api/ai/study-guide/:noteId
 * @access  Private
 */
const generateStudyGuide = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const prompt = `
Based on this study material:
- Title: ${note.title}
- Subject: ${note.subject}
- Tags: ${note.tags.join(', ')}

Generate a comprehensive study guide in JSON format with:
{
  "overview": "Brief overview of the topic",
  "keyTopics": ["topic 1", "topic 2", ...],
  "studyQuestions": [
    {
      "question": "Question text",
      "difficulty": "easy|medium|hard",
      "topic": "related topic"
    }
  ],
  "practiceExercises": ["exercise 1", "exercise 2", ...],
  "studyTips": ["tip 1", "tip 2", ...],
  "estimatedStudyTime": number (in hours),
  "prerequisites": ["prerequisite 1", "prerequisite 2", ...]
}

Respond ONLY with valid JSON.
`;

    const { callMistralAPI } = require('../config/mistral');
    const aiResponse = await callMistralAPI(prompt);

    // Parse JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    let studyGuide;

    if (jsonMatch) {
      try {
        studyGuide = JSON.parse(jsonMatch[0]);
      } catch (e) {
        studyGuide = { rawResponse: aiResponse };
      }
    } else {
      studyGuide = { rawResponse: aiResponse };
    }

    res.status(200).json({
      success: true,
      document: {
        title: note.title,
        subject: note.subject,
        fileUrl: note.fileUrl
      },
      studyGuide
    });

  } catch (error) {
    console.error('Study guide generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate study guide',
      error: error.message 
    });
  }
};

// Update exports
module.exports = {
  summarizeVideo,
  getSummaries,
  getSummaryById,
  deleteSummary,
  testSummarize,
  analyzeDocument,
  generateStudyGuide
};