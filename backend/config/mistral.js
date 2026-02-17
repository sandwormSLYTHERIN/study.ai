const axios = require('axios');
require('dotenv').config();

/**
 * Call Mistral AI via GROQ API
 * @param {string} prompt - The prompt to send to Mistral
 * @returns {Promise<string>} - AI response
 */
const callMistralAPI = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile', // Current recommended model
        messages: [
          {
            role: 'system',
            content: 'You are an intelligent study assistant that helps students learn from educational videos. Provide concise, structured, and educational responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Mistral API Error:', error.response?.data || error.message);
    throw new Error('Failed to get response from AI');
  }
};

/**
 * Generate structured summary from transcript
 * @param {string} transcript - Video transcript
 * @param {string} videoTitle - Optional video title
 * @returns {Promise<Object>} - Structured summary object
 */
const generateSummary = async (transcript, videoTitle = '') => {
  const prompt = `
Analyze the following video transcript and provide a structured study summary.

${videoTitle ? `Video Title: ${videoTitle}` : ''}

Transcript:
${transcript}

Please provide a JSON response with the following structure:
{
  "summary": "A concise 3-4 sentence summary of the main content",
  "keyPoints": ["point 1", "point 2", "point 3", ...],
  "topics": ["topic 1", "topic 2", ...],
  "difficulty": "beginner|intermediate|advanced",
  "estimatedStudyTime": number (in minutes)
}

Respond ONLY with valid JSON, no additional text.
`;

  try {
    const response = await callMistralAPI(prompt);
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
};

/**
 * Generate expected questions from transcript
 * @param {string} transcript - Video transcript
 * @param {string} summary - Video summary
 * @returns {Promise<Array>} - Array of question objects
 */
const generateQuestions = async (transcript, summary) => {
  const prompt = `
Based on this video summary and transcript, generate 5 important study questions that a student should be able to answer after watching this video.

Summary: ${summary}

Transcript: ${transcript.substring(0, 2000)}...

Please provide a JSON response with the following structure:
{
  "questions": [
    {
      "question": "Question text here?",
      "suggestedAnswer": "Brief answer here"
    }
  ]
}

Respond ONLY with valid JSON, no additional text.
`;

  try {
    const response = await callMistralAPI(prompt);
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.questions || [];
  } catch (error) {
    console.error('Question generation error:', error);
    return [];
  }
};

module.exports = {
  callMistralAPI,
  generateSummary,
  generateQuestions
};