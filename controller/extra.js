const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://zafir5370:zafar12345678@cluster1.1dhvutx.mongodb.net/ZAFAR?retryWrites=true&w=majority",
  
   {
     useNewUrlParser: true,
     useUnifiedTopology: true
   }
   );

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection failed:", err);
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

const user_route = require("./routes/userRoute");
app.use("/api", user_route);

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
