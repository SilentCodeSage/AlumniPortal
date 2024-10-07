const AlumniRegistry = require("../models/AlumniRegistry");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    const decoded_idOfUser = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await AlumniRegistry.findById({ _id: decoded_idOfUser._id });

    if (!currentUser) {
      throw new Error("User not Found");
    }

    req.currentUser = currentUser;
    next();
  } catch (error) {
    res.send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
