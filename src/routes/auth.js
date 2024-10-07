const express = require("express");
const authRouter = express.Router();
const {
  validateSignup,
  validateLogin,
  validateUpdate,
} = require("../utils/validation");
const AlumniRegistry = require("../models/AlumniRegistry");
const CollegeRegistry = require("../models/collegeRegistry");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/userAuth");

//signup
authRouter.post("/signup", async (req, res) => {
  try {
    let { admNo, name, branch, graduationDate, email, password } = req.body;
    //Sanitize input.
    validateSignup(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const isAlumniDetailsValid = await CollegeRegistry.findOne({
      admNo,
      name,
      branch,
      graduationDate,
    });

    if (!isAlumniDetailsValid) {
      return res
        .status(404)
        .send("Cannot find an alumni record with the entered details.");
    }

    const isAlumniPresent = await AlumniRegistry.findOne({
      admNo,
      name,
      branch,
      graduationDate,
    });

    //if alumni is already present
    if (isAlumniPresent) {
      return res
        .status(409)
        .send("Alumni record already exists in the database.");
    }
    const alumni = new AlumniRegistry({
      admNo,
      name,
      branch,
      graduationDate,
      email,
      password: hashedPassword,
      regStatus: true,
    });

    await alumni.save();
    res.status(201).send({ message: "Registration Success", alumni });
  } catch (error) {
    console.log(error);
    res.status(500).send("Sign Up failes. Please try again.");
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    //Sanitize Input
    validateLogin(req.body);

    const { email, password } = req.body;
    const user = await AlumniRegistry.findOne({
      email,
    });
    //if no user then  email => invalid
    if (!user) {
      return res.send("Invalid Credentials");
    }
    const userHashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, userHashedPassword);

    if (!isPasswordValid) {
      return res.send("Invalid Credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token);

      res.send("success");
    }
  } catch (error) {
    console.log("Login Failed !");
    res.status(500).send("An error occurred. Please try again.");
  }
});


module.exports = authRouter;
