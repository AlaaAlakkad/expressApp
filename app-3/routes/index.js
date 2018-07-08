const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// ROOT ROUTE
router.get("/", (req, res) =>{
    res.render("landing");
});


// REGISTER

router.get("/register",(req, res)=>{
    res.render("register");
});

router.post("/register", (req, res)=>{
    let newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, (err)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});


// LOGIN

router.get("/login", (req, res )=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local",({
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
})));


// LOGOUT

router.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}


module.exports = router;