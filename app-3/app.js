const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

let campgrounds = [
    {name: "Hosea", image:"http://lablogbeaute.co.uk/wp-content/uploads/2016/07/camping.jpg"},
    {name: "Dameon", image:"https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg"},
    {name: "Maurine Hodkiewicz II", image:"https://www.nationalparks.nsw.gov.au/~/media/20E7E1F7667F42EEA33795B18189210E.ashx"},
    {name: "Hosea", image:"http://lablogbeaute.co.uk/wp-content/uploads/2016/07/camping.jpg"},
    {name: "Dameon", image:"https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg"},
    {name: "Maurine Hodkiewicz II", image:"https://www.nationalparks.nsw.gov.au/~/media/20E7E1F7667F42EEA33795B18189210E.ashx"}

];

app.set("view engine", "ejs");


app.get("/", (req, res) =>{
    res.render("landing");
});

app.get("/campgrounds", (req, res)=>{

    res.render("campgrounds",{campgrounds: campgrounds});
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
})

app.post("/campgrounds", (req, res)=>{
    // get data from form and add it to array
    let body = req.body;
    let campground = {
        name: body.name,
        image: body.image
    };
    campgrounds.push(campground);
    res.redirect("/campgrounds");
});

app.listen(port, ()=> console.log("server started"));
