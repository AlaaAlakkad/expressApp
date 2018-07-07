const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = 3000;

// setup
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");

// database

mongoose.connect('mongodb://localhost/yelp_camp').then(
    ()=>console.log("connected to database "),
    (err)=>console.log(err)
);

const CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", CampgroundSchema);

/* Campground.create({
    name: "Hosea", 
    image:"http://lablogbeaute.co.uk/wp-content/uploads/2016/07/camping.jpg",
    description: "beautiful place"
}, (err, campground)=>{
    if(err) return console.log(err);
    console.log("created successfully", campground);
}) */

/* let campgrounds = [
    {name: "Hosea", image:"http://lablogbeaute.co.uk/wp-content/uploads/2016/07/camping.jpg"},
    {name: "Dameon", image:"https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg"},
    {name: "Maurine Hodkiewicz II", image:"https://www.nationalparks.nsw.gov.au/~/media/20E7E1F7667F42EEA33795B18189210E.ashx"},
    {name: "Hosea", image:"http://lablogbeaute.co.uk/wp-content/uploads/2016/07/camping.jpg"},
    {name: "Dameon", image:"https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg"},
    {name: "Maurine Hodkiewicz II", image:"https://www.nationalparks.nsw.gov.au/~/media/20E7E1F7667F42EEA33795B18189210E.ashx"}

]; */


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
            res.render("index",{campgrounds: camps});
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
    res.render("new");
});

//SHOW
app.get("/campgrounds/:id",(req, res)=>{
    // get the id and find query db
    Campground.findById(req.params.id, (err, foundCamp)=>{
        if(err) res.send("oops! something went wrong!");
        res.render("show",{campground: foundCamp});
    })
})



app.listen(port, ()=> console.log("server started"));
