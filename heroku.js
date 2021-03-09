const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

// Define app
const app = express();

// Template Engine
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(cookieParser()); // read cookies (needed for auth)

// Express session middleware
app.use(
  session({
    secret: "ilovescotchscotchyscotchscotch",
    resave: true,
    saveUninitialized: true
  })
);

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Passport Config
require("./config/passport")(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Messages middleware
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.currDate = Date.now();
  res.locals.appInfo = require("./middlewares/app-info");
  next();
});

app.get("/leads", function(req, res, next) {
  res.locals.leadspage = true;
  next();
});

const leads = require("./routes/api/leads");
const users = require("./routes/api/users");
app.use("/", leads);
app.use("/", users);

app.get("*", function(req, res) {
  return res.render("not-found", {
    title: "Not Found"
  });
});

app.set("port", PORT);
http.createServer(app).listen(parseInt(PORT, 10));
