const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const User = require("./models/user");
const seedDB = require("./seeds");

const commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes= require("./routes/index");

const port = 3000;

// setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


app.set("view engine", "ejs");



// database

mongoose.connect('mongodb://localhost/yelp_camp').then(
    ()=>console.log("connected to database "),
    (err)=>console.log(err)
);

// seedDB();

// PASSPORT CONFIG

app.use(require("express-session")({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(port, ()=> console.log("server started"));
