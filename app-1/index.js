const express = require ("express");

const app = express();

const port = 3000;

app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/users/:username",(req, res)=>{
    let posts = [
        {
            name: "sofi",
            post: "nice!"
        },
        {
            name: "john",
            post: "nice dog",
        },
        {
            name: "jill",
            post: "we missed you"
        }
    ]
    res.render("user",{username:req.params.username, posts:posts});
});

app.get("/bye", (req,res)=>{
    res.send("bye");
});

app.get("/users",(req, res)=>{
    res.send("users");
});

// dynamic routes- route variables


app.get("/repeat/:message/:times", (req, res)=>{
    let result = "";
    let message = req.params.message;
    let times = Number(req.params.times);
    for(let i = 0; i< times; i++)
        result+=message;

    res.send(result);
});

app.get("*",(req, res)=>{
    res.send("page not found");
});

app.listen(3000, ()=>{
    console.log("server started");
});