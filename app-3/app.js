const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
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

seedDB();

// routes
app.get("/", (req, res) =>{
    res.render("landing");
});

//INDEX
app.get("/campgrounds", (req, res)=>{
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
app.post("/campgrounds", (req, res)=>{
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
app.get("/campgrounds/new", (req, res)=>{
    res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id",(req, res)=>{
    // get the id and find query db
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCamp)=>{
        if(err) {
            res.send("oops! something went wrong!");
            return;
        }
        res.render("campgrounds/show",{campground: foundCamp});
    })
})


//================
// COMMENTS ROUTES
//===============

app.get("/campgrounds/:id/comments/new", (req, res)=>{
    // find campground by id
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
            return;
        }
        res.render("comments/new",{campground: camp});
    });
});

app.post("/campgrounds/:id/comments", (req, res)=>{
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


app.listen(port, ()=> console.log("server started"));
