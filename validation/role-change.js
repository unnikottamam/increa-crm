const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRoleChange(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.role = !isEmpty(data.role) ? data.role : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Please select a user";
  }

  if (Validator.isEmpty(data.role)) {
    errors.role = "Please select a role";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
