const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const jwt = require('jsonwebtoken');

const alumniRegistrySchema = new mongoose.Schema({
  admNo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  graduationDate: {
    type: Date,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  profileURL: String,
  regStatus: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true // Make sure email is required for login
  },
  phone: String,
  linkedIn: String,
  addToPublic: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true // Password should be required
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving the document
// alumniRegistrySchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next(); // Only hash if the password is modified or new

//   try {
//     // Hash the password with a salt round of 10
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     return next(error); // Pass error to next middleware
//   }
// });

alumniRegistrySchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, "Alumni@LBS$1029");
    return token;
};

// Creating the AlumniRegistry model
const AlumniRegistry = mongoose.model('AlumniRegistry', alumniRegistrySchema);

module.exports = AlumniRegistry;
