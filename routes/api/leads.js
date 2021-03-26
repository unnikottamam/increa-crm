const express = require("express");
const router = express.Router();
const validateCreateLeadInput = require("../../validation/create-lead");

// Load model
const Lead = require("../../apps/models/Lead");

router.get("/", (req, res) => res.redirect("/leads"));

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

router.get(
  "/lead/view/:_id",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },
  (req, res) => {
    Lead.findOne({ _id: req.params._id })
      .then(lead => {
        if (!lead) {
          req.flash("warning", "There is no lead with this ID");
          return res.redirect("/leads");
        }
        return res.render("lead-view", {
          user: req.user,
          lead: lead
        });
      })
      .catch(err => {
        req.flash("warning", "There is no lead with this ID");
        return res.redirect("/leads");
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

router.get(
  "/create-lead",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },
  function(req, res) {
    return res.render("createlead", {
      user: req.user
    });
  }
);

router.post(
  "/create-lead",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },
  function(req, res) {
    const { errors, isValid } = validateCreateLeadInput(req.body);
    if (!isValid) {
      return res.render("createlead", {
        errors: errors,
        user: req.user
      });
    }

    const leadFields = {};
    if (req.body.firstname) leadFields.firstname = req.body.firstname;
    if (req.body.lastname) leadFields.lastname = req.body.lastname;
    if (req.body.address) leadFields.address = req.body.address;
    if (req.body.phone) leadFields.phone = req.body.phone;
    if (req.body.email) leadFields.email = req.body.email;
    if (req.body.company) leadFields.company = req.body.company;
    if (req.body.tag) leadFields.tag = req.body.tag;

    const newLead = new Lead(leadFields);
    newLead
      .save()
      .then(lead => {
        req.flash("success", "You are successfully created the lead.");
        return res.redirect("/leads");
      })
      .catch(err => {
        req.flash("warning", "Something went wrong.");
        return res.redirect("/leads");
      });
  }
);

// @route   GET /lead/edit/:_id
// @desc    Edit Lead route
// @access  Public
router.get(
  "/lead/edit/:_id",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },
  function(req, res) {
    Lead.findOne({ _id: req.params._id })
      .then(lead => {
        if (!lead || lead.isarchive) {
          req.flash("warning", "Sorry, Archived leads cannot be edited.");
          return res.redirect("/leads");
        }
        res.render("editleads", {
          lead: lead,
          user: req.user
        });
      })
      .catch(err => {
        req.flash("warning", "Sorry, Archived leads cannot be edited.");
        return res.redirect("/leads");
      });
  }
);

// @route   POST /lead/edit/:_id
// @desc    Edit Lead route
// @access  Public
router.post(
  "/lead/edit/:_id",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },
  function(req, res) {
    Lead.findOne({ _id: req.params._id }).then(leadItem => {
      if (!leadItem || leadItem.isarchive) {
        req.flash("warning", "Sorry, Archived lead cannot be edited.");
        return res.redirect("/leads");
      }

      const { errors, isValid } = validateCreateLeadInput(req.body);
      if (!isValid) {
        res.render("editleads", {
          lead: leadItem,
          user: req.user,
          errors: errors
        });
      }

      let editedLead = {};
      editedLead.isarchive = true;
      editedLead.date = leadItem.date;
      editedLead.editedBy = req.user._id;
      editedLead.editedByRole = req.user.role;
      editedLead.editedByDate = Date.now();
      editedLead.originid = leadItem._id;
      if (leadItem.firstname) editedLead.firstname = leadItem.firstname;
      if (leadItem.lastname) editedLead.lastname = leadItem.lastname;
      if (leadItem.address) editedLead.address = leadItem.address;
      if (leadItem.phone) editedLead.phone = leadItem.phone;
      if (leadItem.email) editedLead.email = leadItem.email;
      if (leadItem.company) editedLead.company = leadItem.company;
      const updateLead = new Lead(editedLead);

      if (req.body.firstname) leadItem.firstname = req.body.firstname;
      if (req.body.lastname) leadItem.lastname = req.body.lastname;
      if (req.body.address) leadItem.address = req.body.address;
      if (req.body.phone) leadItem.phone = req.body.phone;
      if (req.body.email) leadItem.email = req.body.email;
      if (req.body.company) leadItem.company = req.body.company;
      if (req.body.tag) req.body.tag = req.body.tag;
      leadItem.editedBy = req.user._id;
      leadItem.date = Date.now();
      leadItem.editedByDate = Date.now();
      leadItem.editedByRole = req.user.role;

      leadItem.save().then(leadItem => {
        updateLead.save().then(lead => {
          req.flash("success", "You are successfully edited the lead.");
          res.redirect("/leads");
        });
      });
    });
  }
);

router.post("/lead/delete-lead/:_id", function(req, res) {
  Lead.findOneAndRemove({ _id: req.params._id })
    .then(leadItem => {
      Lead.findOneAndRemove({ originid: leadItem._id }).then(archiveItem => {
        req.flash("success", `Deleted the Lead!`);
        return res.redirect("/leads");
      });
      req.flash("success", `Deleted the Lead!`);
      return res.redirect("/leads");
    })
    .catch(err => {
      req.flash("warning", `Something went wrong`);
      return res.redirect("/leads");
    });
});

// Access Roles for the leads
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
