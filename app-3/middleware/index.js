const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, camp)=>{
            if(err){
                req.flash("error", "Campground not found");
                return redirect("back");
            }

            if(camp.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentsOwnership = (req, res, next)=>{

    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, comment)=>{
            if(err)
            return redirect("back");

            if(comment.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()) return next();
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};
module.exports = middlewareObj;