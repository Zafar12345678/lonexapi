const express = require("express");
const user_route = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const user_controller = require("../controller/userController");
const auth = require("../middleware/auth");


// Body parsing middleware
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
user_route.use(express.static("public"));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userimage"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

// User registration route with image upload
user_route.post("/register", upload.single("image"), user_controller.register_user);
user_route.post("/login", user_controller.user_login);

// Protected route using the auth middleware

user_route.post("/test", auth, function (req, res) {
  res.status(200).send({ success: true, msg: "authendicate" });
});

// Route to update user password
user_route.post("/update-password", user_controller.update_password);
user_route.post("/forgate_password", user_controller.forgate_password);

module.exports = user_route;
