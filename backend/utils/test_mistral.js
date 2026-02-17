require('dotenv').config();
const axios = require('axios');

async function testGroq() {
  try {
    console.log('Testing GROQ API...');
    console.log('API Key:', process.env.GROQ_API_KEY ? 'Found ✅' : 'Missing ❌');

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile', // Current recommended model
        messages: [
          {
            role: 'user',
            content: 'Who is Jeffrey Epstein?'
          }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ GROQ API Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ GROQ API Error:', error.response?.data || error.message);
  }
}

testGroq();