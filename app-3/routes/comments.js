const express = require("express");
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// comments new 
router.get("/new", isLoggedIn,(req, res)=>{
    // find campground by id
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
            return;
        }
        res.render("comments/new",{campground: camp});
    });
});

// comments create
router.post("/",isLoggedIn ,(req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        Comment.create(req.body.comment, (err, comment)=>{
            if(err){
                return console.log("something went wrong " + err);
            }

            campground.comments.push(comment._id);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
        });
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}

module.exports = router;
