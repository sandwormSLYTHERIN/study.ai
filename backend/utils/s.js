const mongoose = require('mongoose');

// Single server connection
const uri = "mongodb://dtejeshwar9_db_user:Mong1029@ac-lrsmj6z-shard-00-00.0hsg5nn.mongodb.net:27017/test?ssl=true&authSource=admin&directConnection=true";

console.log("Testing single server...");

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Connected!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("❌ Failed:", error.message);
  });