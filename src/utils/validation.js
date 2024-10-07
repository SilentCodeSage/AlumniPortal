const validateSignup = (req) => {
  const requiredFields = [
    "admNo",
    "name",
    "branch",
    "graduationDate",
    "email",
    "password",
  ];

  const isrequiredFeilds = Object.keys(req).every((k) => {
    return requiredFields.includes(k);
  });

  if (!isrequiredFeilds) {
    throw new Error("req format error");
  }
};
const validateLogin = (req) => {
  const requiredFields = ["email", "password"];

  const isrequiredFeilds = Object.keys(req).every((k) => {
    return requiredFields.includes(k);
  });

  if (!isrequiredFeilds) {
    return res.status(404).send("Invalid req format");
  }
};
const validateUpdate = (req) => {
  const allowedFields = ["profileURL", "phone","linkedIn","addToPublic"];

  const isallowedFields = Object.keys(req).every((k) => {
    return allowedFields.includes(k);
  });

  if (!allowedFields) {
    return res.status(404).send("Invalid req format");
  }
};

module.exports = {
  validateSignup,
  validateLogin,
  validateUpdate,
};
