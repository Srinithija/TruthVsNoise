require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/truthvsnoise";
console.log("JWT SECRET:", process.env.JWT_SECRET);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
