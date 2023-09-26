const express = require("express");
const store_route = express();
const bodyparser = require("body-parser");
const multer = require("multer");
const path = require("path");
const store_controller = require("../controller/storecontroller");
//const auth = require("../middleware/auth");



store_route.use(bodyparser.json());
store_route.use(bodyparser.urlencoded({ extended: true }));
store_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/storeImage"));
  },
  filename: function (req, file, cb) {
    // You can customize the filename as needed, for example:
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });
const auth = require('../middleware/auth');
store_route.post("/create-store", auth,upload.single("logo"), store_controller.create_store);


module.exports = store_route;
