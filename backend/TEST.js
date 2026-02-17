require('dotenv').config();
const cloudinary = require('./config/cloudinary');

async function testCloudinary() {
  try {
    console.log('🧪 Testing Cloudinary Connection...');
    console.log('📋 Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Found' : '❌ Missing');
    console.log('📋 API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Found' : '❌ Missing');
    console.log('📋 API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Found' : '❌ Missing');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('\n❌ Please add all Cloudinary credentials to your .env file');
      return;
    }

    console.log('\n☁️ Testing Cloudinary API...\n');
    
    // Test by getting account details
    const result = await cloudinary.api.ping();
    
    console.log('✅ SUCCESS! Cloudinary is connected!');
    console.log('Response:', result);
    console.log('\n🎉 You can now upload files to Cloudinary!');
    
  } catch (error) {
    console.error('\n❌ Cloudinary Test Failed:');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your credentials in .env file');
    console.log('2. Make sure Cloud Name, API Key, and API Secret are correct');
    console.log('3. Verify at https://console.cloudinary.com/');
  }
}

testCloudinary();

/*
Backend Process:

Multer receives the file from the request
multer-storage-cloudinary automatically uploads to Cloudinary
Cloudinary returns a URL: https://res.cloudinary.com/your-cloud/...
MongoDB saves: title, tags, Cloudinary URL, file metadata
Backend returns the note object to frontend
*/