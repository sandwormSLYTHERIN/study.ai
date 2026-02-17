const { YoutubeTranscript } = require('youtube-transcript');

async function testTranscript() {
  try {
    console.log('Testing YouTube transcript extraction...\n');
    
    const videoId = 'NybHckSEQBI'; // Khan Academy video
    console.log('Video ID:', videoId);
    console.log('Fetching transcript...\n');
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    console.log('✅ Transcript fetched successfully!');
    console.log('Number of segments:', transcript.length);
    console.log('\nFirst 5 segments:');
    console.log(transcript.slice(0, 5));
    
    const fullText = transcript.map(item => item.text).join(' ');
    console.log('\nFull transcript preview (first 500 chars):');
    console.log(fullText.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('❌ Transcript fetch failed:');
    console.error('Error:', error.message);
  }
}

testTranscript();