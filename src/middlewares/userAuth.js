// Imports
const AlumniRegistry = require("../models/AlumniRegistry");
const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate users via JWT in cookies.
 * Verifies token, finds user by decoded ID, and attaches user to req object.
 * Responds with 401 if authentication fails.
 */
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Authentication token is required.");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await AlumniRegistry.findById(decoded._id);

    if (!currentUser) throw new Error("User not Found");

    req.currentUser = currentUser;
    next();
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

module.exports = { userAuth };
