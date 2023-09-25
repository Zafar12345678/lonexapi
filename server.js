const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Use cors middleware to enable CORS
app.use(cors());

// Import and use your routes
const user_route = require("./routes/userRoute");
const store_route = require("./routes/storerRoute");

app.use("/user", user_route);
app.use("/user", store_route); // You might want to use a different path like "/store" for your store routes

const PORT = process.env.PORT || 3000; // Use the PORT environment variable if available
const DB = process.env.MONGO_URI; // Use the MONGO_URI environment variable

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
