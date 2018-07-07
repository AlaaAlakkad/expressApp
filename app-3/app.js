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
    image: String
});

const Campground = mongoose.model("Campgound", CampgroundSchema);

/* Campground.create({
    name: "Hosea", 
    image:"http://lablogbeaute.co.uk/wp-content/uploads/2016/07/camping.jpg"
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

app.get("/campgrounds", (req, res)=>{
    // query database 
    Campground.find({},(err, camps)=>{
        if(err) {
            res.send("something went wrong sorry") 
        }else{
            res.render("campgrounds",{campgrounds: camps});
        }
    })
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
})

app.post("/campgrounds", (req, res)=>{
    // get data from request body
    let body = req.body;
    let campground = {
        name: body.name,
        image: body.image
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

app.listen(port, ()=> console.log("server started"));
