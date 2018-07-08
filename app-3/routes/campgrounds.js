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
router.post("/", (req, res)=>{
    // get data from request body
    let body = req.body;
    let campground = {
        name: body.name,
        image: body.image,
        description: body.description
    };
    // add it to database 
    Campground.create(campground, (err, created)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

// NEW
router.get("/new", (req, res)=>{
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

module.exports = router;

