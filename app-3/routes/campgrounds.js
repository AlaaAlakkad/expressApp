const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

//INDEX
router.get("/", (req, res)=>{

    // query database 
    Campground.find({},(err, camps)=>{
        if(err) {
            res.send("something went wrong sorry") 
        }else{
            res.render("campgrounds/index",{campgrounds: camps});
        }
    })
});

// CREATE
router.post("/", isLoggedIn, (req, res)=>{
    // get data from request body
    let body = req.body;
    let author = {
        id: req.user._id,
        username: req.user.username
    };

    let campground = {
        name: body.name,
        image: body.image,
        description: body.description,
        author: author
    };
    // add it to database 
    Campground.create(campground, (err, created)=>{
        if(err){
            console.log(err);
        }else{
            console.log(created);
            res.redirect("/campgrounds");
        }
    });
});

// NEW
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});

//SHOW
router.get("/:id",(req, res)=>{
    // get the id and find query db
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCamp)=>{
        if(err) {
            res.send("oops! something went wrong!");
            return;
        }
        res.render("campgrounds/show",{campground: foundCamp});
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}

module.exports = router;

