const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { validateUpdate } = require("../utils/validation");

//update user
userRouter.put("/updateUser", userAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;
    //Sanitize input
    validateUpdate(req.body);
    Object.keys(req.body).forEach((key) => {
      currentUser[key] = req.body[key];
    });

    const result = await currentUser.save();
    res.send(result);
  } catch (error) {
    res.send("Error:" + error.message);
  }
});

module.exports = userRouter;
