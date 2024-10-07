const mongoose = require('mongoose');

const collegeRegistrySchema = new mongoose.Schema({
  admNo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  graduationDate: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  }
});

// Creating the CollegeRegistry model
const CollegeRegistry = mongoose.model('CollegeRegistry', collegeRegistrySchema);

module.exports = CollegeRegistry;
