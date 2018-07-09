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
            // add username and id to the comment 
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment._id);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
        });
    });
});

// comment edit
router.get("/:comment_id/edit", (req, res)=>{
    Comment.findById(req.params.comment_id, (err, comment)=>{
        if(err) return res.redirect("back");
        res.render("comments/edit", {campground_id: req.params.id, comment: comment});
    })
});

// comment update
router.put("/:comment_id", (req, res)=>{

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err) return res.redirect("back");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// comment delete
router.delete("/:comment_id", (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment)=>{
        if(err) return redirect("back");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}

module.exports = router;
