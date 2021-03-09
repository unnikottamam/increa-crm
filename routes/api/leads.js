const express = require("express");
const router = express.Router();
const validateCreateLeadInput = require("../../validation/create-lead");

// Load model
const Lead = require("../../apps/models/Lead");

router.get("/", function(req, res) {
  if (req.user) {
    return res.redirect("/leads");
  } else {
    return res.render("home", {
      title: "Dashboard",
      user: req.user
    });
  }
});

router.get(
  "/leads",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },

  function(req, res) {
    Lead.find().then(leads => {
      return res.render("leads", {
        user: req.user,
        title: "Leads",
        leads: leads
      });
    });
  }
);

router.post("/lead", function(req, res) {
  const { errors, isValid } = validateCreateLeadInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const leadFields = {};
  if (req.body.firstname) leadFields.firstname = req.body.firstname;
  if (req.body.lastname) leadFields.lastname = req.body.lastname;
  if (req.body.address) leadFields.address = req.body.address;
  if (req.body.phone) leadFields.phone = req.body.phone;
  if (req.body.email) leadFields.email = req.body.email;
  if (req.body.company) leadFields.company = req.body.company;

  const newLead = new Lead(leadFields);
  newLead
    .save()
    .then(lead => {
      return res.json({ success: true, lead: lead });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ error: "There is an error in your submission" });
    });
});

function accessRoles(req, res, next, userRole) {
  if (req.user) {
    if (userRole.test(req.user.role)) {
      next();
    } else {
      res.redirect("/no-permission");
    }
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
