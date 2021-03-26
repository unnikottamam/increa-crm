const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCreateLeadInput(data) {
  let errors = {};

  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isLength(data.firstname, { min: 2, max: 30 })) {
    errors.firstname = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = "Name is mandatory";
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = "Address is mandatory";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone is mandatory";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is mandatory";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
