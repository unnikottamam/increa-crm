const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../../validation/register");
const validateRoleChange = require("../../validation/role-change");
const validateAddClientInput = require("../../validation/add-client");
const validateEditClientInput = require("../../validation/edit-client");
const validateAdminPasswordChange = require("../../validation/admin-password-change");

// Load models
const User = require("../../apps/models/User");
const Client = require("../../apps/models/Client");
const Lead = require("../../apps/models/Lead");

// @route   GET /admin
// @desc    Admin route
// @access  Private
router.get(
  "/",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },
  function(req, res) {
    return res.render("admin/settings", {
      user: req.user,
      title: "Settings"
    });
  }
);

// @route   GET /admin/settings
// @desc    Settings route
// @access  Private
router.get(
  "/settings",
  (req, res, next) => {
    accessRoles(req, res, next, /admin|worker/);
  },
  function(req, res) {
    return res.render("admin/settings", {
      user: req.user,
      title: "Settings"
    });
  }
);

// @route   POST /admin/password-change
// @desc    Settings : User password change route
// @access  Private
router.post(
  "/password-change",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    const { errors, isValid } = validateAdminPasswordChange(req.body);

    // Check validation
    if (!isValid) {
      req.flash(
        "warning",
        "Please provide a password and both should be match"
      );
      return res.redirect("/admin/settings");
    }

    User.findOne({ _id: req.user._id }).then(user => {
      if (!user) {
        req.flash("warning", "There is no such user exists");
        return res.redirect("/admin/settings");
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => {
              req.flash("success", `Your password is changed`);
              return res.redirect("/admin/settings");
            })
            .catch(err => {
              req.flash("danger", "Something went wrong");
              return res.redirect("/admin/settings");
            });
        });
      });
    });
  }
);

// @route   GET /admin/users
// @desc    Users List route
// @access  Private
router.get(
  "/users",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    User.find().then(users => {
      return res.render("users", {
        user: req.user,
        title: "Users",
        users: users
      });
    });
  }
);

// @route   GET /admin/user-role-change/:_id
// @desc    Users List route
// @access  Public
router.get(
  "/user-role-change/:_id",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    User.findOne({ _id: req.params._id })
      .then(user => {
        if (user) {
          return res.render("admin/user-role", {
            currentUser: user,
            user: req.user
          });
        } else {
          req.flash("warning", "There is no such user exists");
          res.redirect("/admin/users");
        }
      })
      .catch(err => {
        req.flash("warning", "There is no such user exists");
        res.redirect("/admin/users");
      });
  }
);

// @route   POST /admin/user-role-change
// @desc    User Management route
// @access  Private
router.post(
  "/user-role-change",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    const { errors, isValid } = validateRoleChange(req.body);

    // Check validation
    if (!isValid) {
      return res.render("admin/user-role", {
        currentUser: user,
        user: req.user,
        errors: errors
      });
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        req.flash("warning", "There is no such user exists");
        return res.redirect("/admin/users");
      }
      user.role = req.body.role;
      user
        .save()
        .then(user => {
          req.flash(
            "success",
            `Role of User ${user.name} is changed to ${user.role}`
          );
          return res.redirect("/admin/users");
        })
        .catch(err => {
          req.flash("danger", "Something went wrong");
          return res.redirect("/admin/users");
        });
    });
  }
);

// @route   GET /admin/clients
// @desc    Clients List route
// @access  Private
router.get(
  "/clients",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    Client.find().then(clients => {
      return res.render("clients", {
        user: req.user,
        title: "Clients",
        clients: clients
      });
    });
  }
);

// @route   GET /admin/client/:_id
// @desc    Clients List route
// @access  Private
router.get(
  "/client/view/:_id",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    Client.findOne({ _id: req.params._id })
      .then(client => {
        if (!client) {
          req.flash("warning", "Sorry, There is no client with this ID.");
          return res.redirect("/admin/clients");
        }
        return res.render("admin/client-view", {
          clients: client,
          user: req.user
        });
      })
      .catch(err => {
        req.flash("warning", "Sorry, Something went wrong.");
        return res.redirect("/admin/clients");
      });
  }
);

// @route   GET /admin/client/add
// @desc    Add route
// @access  Private
router.get(
  "/add-client",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    return res.render("admin/add-client", {
      user: req.user
    });
  }
);

// @route   POST /admin/add-client
// @desc    Add Client route
// @access  Private
router.post(
  "/add-client",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    const { errors, isValid } = validateAddClientInput(req.body);

    // Check validation
    if (!isValid) {
      return res.render("admin/add-client", {
        addclientErrors: errors,
        user: req.user
      });
    }

    Client.findOne({ email: req.body.email }).then(client => {
      if (client) {
        req.flash("warning", "Client with this e-mail address already exists.");
        return res.render("admin/add-client", {
          user: req.user
        });
      } else {
        const newClient = new Client({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          createdBy: req.user._id,
          createdByRole: req.user.role
        });

        newClient
          .save()
          .then(client => {
            req.flash("success", `Client, ${client.name} is added`);
            return res.redirect("/admin/clients");
          })
          .catch(err => {
            req.flash("warning", "Something went wrong !");
            return res.redirect("/admin/clients");
          });
      }
    });
  }
);

// @route   GET /admin/client/edit/:_id
// @desc    Edit Client route
// @access  Private
router.get(
  "/client/edit/:_id",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    Client.findOne({ _id: req.params._id })
      .then(client => {
        if (!client) {
          req.flash(
            "warning",
            "Sorry, There is no user with this ID. You can select different client from the below client lists."
          );
          return res.redirect("/admin/clients");
        }
        res.render("admin/add-client", {
          clients: client,
          user: req.user
        });
      })
      .catch(err => {
        req.flash(
          "warning",
          "Sorry, There is no user with this ID. You can select different client from the below client lists."
        );
        return res.redirect("/admin/clients");
      });
  }
);

// @route   POST /admin/client/edit/:_id
// @desc    Add Client route
// @access  Private
router.post(
  "/client/edit/:_id",
  (req, res, next) => {
    accessRoles(req, res, next, /admin/);
  },
  function(req, res) {
    const { errors, isValid } = validateEditClientInput(req.body);
    const clientFields = {};
    if (req.body.name) clientFields.name = req.body.name;
    if (req.body.phone) clientFields.phone = req.body.phone;
    if (req.body.address) clientFields.address = req.body.address;

    Client.findOne({ _id: req.params._id }).then(client => {
      // Check validation
      if (!isValid) {
        return res.render("admin/add-client", {
          addclientErrors: errors,
          user: req.user,
          clients: client
        });
      }
      if (client) {
        clientFields.email = client.email;
        Client.findOneAndUpdate(
          { _id: client._id },
          { $set: clientFields },
          { new: true }
        ).then(client => {
          req.flash(
            "success",
            `You are successfully edit the client: ${client.name}`
          );
          return res.redirect(`/admin/clients`);
        });
      } else {
        req.flash("warning", "There is no such client exists.");
        return res.redirect(`/admin/clients`);
      }
    });
  }
);

function accessRoles(req, res, next, userRole) {
  if (req.user) {
    if (userRole.test(req.user.role)) {
      next();
    } else {
      console.log("No Access");
      res.redirect("/no-permission");
    }
  } else {
    console.log("Need to login");
    res.redirect("/login");
  }
}

module.exports = router;
