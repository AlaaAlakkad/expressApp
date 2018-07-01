const express = require ("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

request.get("",(err, res, body)=>{
    console.log(res.statusCode);
    console.log(JSON.parse(body));
})

const port = 3000;

let friends = ["Weldon", "Kitty", "Carmen", "Nelle"];

app.get("/", (req, res)=>{
    res.render("home")
});

app.get("/friends",(req, res)=>{
    
    res.render("friends",{friends: friends});

});

// post route
app.post("/addfriend",(req, res)=>{
    console.log(req.body);
    friends.push(req.body.newfriend);
    res.redirect("/friends");
});

app.listen(port, ()=>{
    console.log("server started...");
})