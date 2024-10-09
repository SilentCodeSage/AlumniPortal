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

    // Validate and sanitize input fields
    validateSignup(req.body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse the graduation date to a Date object
    const parsedGraduationDate = new Date(graduationDate);

    // Verify if alumni details exist in the CollegeRegistry
    const isAlumniDetailsValid = await CollegeRegistry.findOne({
      admNo,
      name,
      branch,
      graduationDate: parsedGraduationDate,
    });

    // If no valid alumni details are found
    if (!isAlumniDetailsValid) {
      return res
        .status(404)
        .send("Cannot find an alumni record with the entered details.");
    }

    // Check if alumni record already exists in AlumniRegistry
    const isAlumniPresent = await AlumniRegistry.findOne({
      admNo,
      name,
      branch,
      graduationDate: parsedGraduationDate,
    });

    // If alumni record already exists
    if (isAlumniPresent) {
      return res
        .status(409)
        .send("Alumni record already exists in the database.");
    }

    // Create a new alumni record
    const alumni = new AlumniRegistry({
      admNo,
      name,
      branch,
      graduationDate: parsedGraduationDate,
      email,
      password: hashedPassword,
      regStatus: true,
    });

    // Save the alumni record to the database
    await alumni.save();
    res.status(201).send({ message: "Registration Success", alumni });
  } catch (error) {
    console.log(error);
    res.status(500).send("Sign Up failed. Please try again.");
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    // Sanitize and validate input fields
    validateLogin(req.body);

    const { email, password } = req.body;

    // Find user by email in AlumniRegistry
    const user = await AlumniRegistry.findOne({ email });

    // If user doesn't exist, return invalid credentials
    if (!user) {
      return res.send("Invalid Credentials");
    }

    // Get the stored hashed password from the user record
    const userHashedPassword = user.password;

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, userHashedPassword);

    // If the password is incorrect
    if (!isPasswordValid) {
      return res.send("Invalid Credentials");
    } else {
      // Generate a JWT token for the authenticated user
      const token = await user.getJWT();

      // Set the token in the response cookies
      res.cookie("token", token);

      // Send success response
      res.status(200).json({ message: "Login Success", data: user });
    }
  } catch (error) {
    console.log("Login Failed !");
    res.status(500).send("An error occurred. Please try again.");
  }
});


module.exports = authRouter;
