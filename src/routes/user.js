const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { validateUpdate } = require("../utils/validation");
const CollegeRegistry = require("../models/collegeRegistry");

// update user
userRouter.put("/updateUser", userAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;

    // Sanitize input to prevent malicious or incorrect data
    validateUpdate(req.body);

    // Update the user fields based on the request body
    Object.keys(req.body).forEach((key) => {
      currentUser[key] = req.body[key]; 
    });

    // Save the updated user document
    const result = await currentUser.save();

    res.status(200).json({
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user profile",
      error: error.message,
    });
  }
});

// get present alumni details without logging in
userRouter.get("/viewAlumni", async (req, res) => {
  try {
    // Parse the year query parameter
    const year = parseInt(req.query.year);

    // Return 400 if the year is missing or invalid
    if (!year) {
      return res.status(400).json({
        message: "Year is required and must be a valid number",
      });
    }

    // Aggregate query to fetch alumni based on the given year
    const listOfAlumnis = await CollegeRegistry.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: "$graduationDate" }, year] },
        },
      },
      {
        $project: {
          name: 1,
          graduationDate: 1,
          branch: 1, 
        },
      },
    ]);

    // Respond with the alumni list if results are found, otherwise return a 404
    if (listOfAlumnis.length > 0) {
      res.status(200).json({
        message: "Alumni found for the given year",
        data: listOfAlumnis,
      });
    } else {
      res.status(404).json({
        message: "No alumni found for the given year",
      });
    }
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({
      message: "An error occurred while fetching alumni",
      error: error.message, 
    });
  }
});

userRouter.get("/currentUser", userAuth, async (req, res) => {
  try {
    // Retrieve the currently authenticated user from the request object
    const currentUser = req.currentUser;

    // Check if the currentUser exists
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Current user fetched successfully",
      data: currentUser,
    });
  } catch (error) {
    console.error("Error fetching current user: ", error);
    res.status(500).json({
      message: "An error occurred while fetching user details",
      error: error.message,
    });
  }
});

// to add dummy data to the user
userRouter.post("/addUsersToCollegeRegistry", async (req, res) => {
  try {
    // Extracting the required fields from the request body
    const { admNo, name, graduationDate, branch } = req.body;

    // Validating that all required fields are present
    if (!admNo || !name || !graduationDate || !branch) {
      return res
        .status(400)
        .send("All fields (admNo, name, graduationDate, branch) are required");
    }

    // Parsing the graduationDate to ensure it's a valid Date object
    const parsedGraduationDate = new Date(graduationDate);

    // Checking if the parsed graduationDate is a valid date
    if (isNaN(parsedGraduationDate)) {
      return res.status(400).send("Invalid graduationDate format");
    }

    // Creating a new document for the CollegeRegistry collection
    const newCollegeUser = new CollegeRegistry({
      admNo,
      name,
      graduationDate: parsedGraduationDate, // Store the parsed Date object
      branch,
    });

    // Saving the document to the database
    await newCollegeUser.save();

    // Sending a success response
    res.status(201).send({
      message: "User added to college registry successfully",
      data: newCollegeUser,
    });
  } catch (error) {
    // Handling errors and sending appropriate responses
    res
      .status(500)
      .send({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = userRouter;
