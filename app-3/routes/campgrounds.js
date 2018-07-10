const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const middleware = require("../middleware");


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
router.post("/", middleware.isLoggedIn, (req, res)=>{
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
        author: author,
        price: body.price
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
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});

// SHOW
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

// EDIT

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
        Campground.findById(req.params.id, (err, camp)=>{
            res.render("campgrounds/edit", {campground: camp});
        });
});

// UPDATE

router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp)=>{
        if(err)
        return res.redirect("/campgrounds");

        res.redirect("/campgrounds/" + req.params.id);

    } );
});


// DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err)
        return res.redirect("/campgrounds");
        res.redirect("/campgrounds");
    });
});

module.exports = router;

