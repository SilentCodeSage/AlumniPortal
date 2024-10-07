const express = require("express");
const authRouter = require("./routes/auth");
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user");
require('dotenv').config();

const app = express();

const PORT = 3000;
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!"); // Send a simple response
});

connectDB().then(() => {
  console.log("Connected to the database");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) =>{
    console.log("Connection to the database failed: "+err);
});
