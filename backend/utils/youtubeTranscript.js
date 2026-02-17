const axios = require('axios');

/**
 * Method 1: Direct YouTube API timedtext endpoint
 */
const fetchTranscriptMethod1 = async (videoId) => {
  try {
    const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`;
    const response = await axios.get(url);
    
    if (response.data && response.data.events) {
      const transcript = response.data.events
        .filter(event => event.segs)
        .map(event => event.segs.map(seg => seg.utf8).join(''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return transcript;
    }
    throw new Error('No transcript data');
  } catch (error) {
    throw new Error('Method 1 failed');
  }
};

/**
 * Method 2: Fetch from YouTube page and extract caption tracks
 */
const fetchTranscriptMethod2 = async (videoId) => {
  try {
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    
    // Extract captions data
    const captionsRegex = /"captionTracks":(\[.*?\])/;
    const match = html.match(captionsRegex);
    
    if (!match) {
      throw new Error('No captions found');
    }

    const captionTracks = JSON.parse(match[1]);
    const englishTrack = captionTracks.find(track => 
      track.languageCode === 'en' || track.languageCode.startsWith('en')
    );

    if (!englishTrack) {
      throw new Error('No English captions');
    }

    // Fetch the actual transcript
    const transcriptResponse = await axios.get(englishTrack.baseUrl);
    const transcriptData = transcriptResponse.data;

    // Parse XML
    const textRegex = /<text[^>]*>(.*?)<\/text>/g;
    let transcript = '';
    let match2;

    while ((match2 = textRegex.exec(transcriptData)) !== null) {
      let text = match2[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();
      
      if (text) {
        transcript += text + ' ';
      }
    }

    return transcript.trim();
  } catch (error) {
    throw new Error('Method 2 failed');
  }
};

/**
 * Method 3: Alternative timedtext format
 */
const fetchTranscriptMethod3 = async (videoId) => {
  try {
    const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`;
    const response = await axios.get(url);
    
    const transcript = response.data
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    
    if (transcript.length < 100) {
      throw new Error('Transcript too short');
    }
    
    return transcript;
  } catch (error) {
    throw new Error('Method 3 failed');
  }
};

/**
 * Method 4: Try multiple language codes
 */
const fetchTranscriptMethod4 = async (videoId) => {
  const langCodes = ['en', 'en-US', 'en-GB', 'a.en'];
  
  for (const lang of langCodes) {
    try {
      const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}`;
      const response = await axios.get(url, { timeout: 5000 });
      
      const transcript = response.data
        .replace(/<[^>]*>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      
      if (transcript.length >= 100) {
        return transcript;
      }
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('Method 4 failed');
};

/**
 * Main function: Try all methods in sequence
 */
const fetchYouTubeTranscript = async (videoId) => {
  const methods = [
    { name: 'Method 1 (JSON3)', fn: fetchTranscriptMethod1 },
    { name: 'Method 2 (Page Parse)', fn: fetchTranscriptMethod2 },
    { name: 'Method 3 (Direct XML)', fn: fetchTranscriptMethod3 },
    { name: 'Method 4 (Multi-Lang)', fn: fetchTranscriptMethod4 }
  ];

  let lastError;

  for (const method of methods) {
    try {
      console.log(`Trying ${method.name}...`);
      const transcript = await method.fn(videoId);
      
      if (transcript && transcript.length >= 100) {
        console.log(`✅ ${method.name} succeeded! Length: ${transcript.length}`);
        return transcript;
      }
    } catch (error) {
      console.log(`❌ ${method.name} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`All transcript methods failed. Last error: ${lastError?.message}`);
};

module.exports = { fetchYouTubeTranscript };