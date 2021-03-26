const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../apps/models/User");

// @route   GET /test
// @desc    Test users route
// @access  Public
router.get("/", (req, res) => res.redirect("/leads"));

// @route   GET /register
// @desc    Register route
// @access  Public
router.get("/register", (req, res) => {
  res.render("register");
});

// @route   POST /register
// @desc    Register route
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.render("register", {
      errors: errors,
      form: req.body
    });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      req.flash("warning", "Email already exists");
      return res.render("register");
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              req.flash("success", "You are now registered and can log in");
              res.redirect("/login");
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET /login
// @desc    Login route
// @access  Public
router.get("/login", (req, res) => {
  res.render("login");
});

// @route   POST /login
// @desc    Login route
// @access  Public
router.post("/login", (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.render("login", {
      errors: errors
    });
  }

  passport.authenticate("local", {
    successRedirect: "/leads",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

// @route   GET /logout
// @desc    Logout route
// @access  Public
// logout
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/login");
});

// @route   GET /no-permission
// @desc    No Access route
// @access  Public
router.get("/no-permission", function(req, res) {
  if (req.user) {
    return res.render("no-access", {
      title: "No Access"
    });
  } else {
    return res.redirect("/login");
  }
});

module.exports = router;
