const jwt = require("jsonwebtoken");
const config = require("../config/config"); // Fix the path to config

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"]; // Correct the header name

  if (!token) {
    return res
      .status(401) // Change the status to 401 for authentication failure
      .send({ success: false, msg: "A token is required for authorization" });
  }

  try {
    const decoded = jwt.verify(token, config.secret_jwt);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).send({ success: false, msg: "Invalid token" });
  }
};

module.exports = verifyToken;
