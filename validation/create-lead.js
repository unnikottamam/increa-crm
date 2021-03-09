const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCreateLeadInput(data) {
  let errors = {};

  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.home_address = !isEmpty(data.home_address) ? data.home_address : "";
  data.home_phone = !isEmpty(data.home_phone) ? data.home_phone : "";
  data.emergency_phone = !isEmpty(data.emergency_phone) ? data.emergency_phone : "";
  data.dob = !isEmpty(data.dob) ? data.dob : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!Validator.isLength(data.first_name, { min: 2, max: 30 })) {
    errors.first_name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = "Name is mandatory";
  }

  if (Validator.isEmpty(data.home_address)) {
    errors.home_address = "Home address is mandatory";
  }

  if (Validator.isEmpty(data.home_phone)) {
    errors.home_phone = "Home phone is mandatory";
  }

  if (Validator.isEmpty(data.emergency_phone)) {
    errors.emergency_phone = "Emergency contact number is mandatory";
  }

  if (Validator.isEmpty(data.dob)) {
    errors.dob = "Date of birth is mandatory";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is mandatory";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
