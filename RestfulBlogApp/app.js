const express = require ("express"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require ("method-override"),
bodyParser    = require ("body-parser"),
mongoose      = require ("mongoose"),
app           = express ();

const port = 3000;

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); // must be after body parses
app.use(methodOverride("_method"));

// MONGOOSE SCHEMA
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);


// RESTFUL ROUTES

// INDEX

app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req, res)=>{
    // get blogs from db
    Blog.find({},(err, blogs)=>{
        if(err) return console.log(err);
        res.render("index", {blogs: blogs});
    });
});

// NEW ROUTE

app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

// CREATE ROUTE

app.post("/blogs", (req, res)=>{
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err) {
            res.render("new");
        }else{
            res.redirect("/blogs")
        }
    });
});

// SHOW

app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id,(err, foundBlog)=>{
        if(err) {
            res.redirect('/blogs');
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT

app.get("/blogs/:id/edit", (req, res)=>{
    
    Blog.findById(req.params.id,(err, foundBlog)=>{
        if(err) {
            res.redirect('/blogs');
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE

app.put("/blogs/:id", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body); // TODO use a middleware 
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE

app.delete(("/blogs/:id"), (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});

app.listen(port, ()=>{
    console.log("server started");
});
