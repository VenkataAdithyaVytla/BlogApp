var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride  = require('method-override');
var expressSanitizer = require('express-sanitizer');
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1617444114429-fc5dd4bca329?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzMnx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//     body: "HELLO this is a blog post"
// });

// RESTFUL ROUTES

app.get("/",function(req,res){
    res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log("Error");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});
// NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//  CREATE ROUTE
app.post("/blogs",function(req,res){
    //crate blog then redirect to index
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
// SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("show", {blog: foundBlog});
        }
    });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});
// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
// Delete ROUTE
app.delete("/blogs/:id", function(req,res){
    // destroy blog and redirect somewhere
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});


















app.listen(3000,function(){
    console.log("server has started!");
})
