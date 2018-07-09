const Campground = require("../models/campground");
const Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, camp)=>{
            if(err)
            return redirect("back");

            if(camp.author.id.equals(req.user._id)){
                next();
            }else{
                res.redirect("back");
            }
        });
    }else{
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
                res.redirect("back");
            }
        });
    }else{
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
};
module.exports = middlewareObj;