//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const {mongoose} = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin:408126@cluster0.yhubrpl.mongodb.net/todoDB?retryWrites=true&w=majority", {useNewUrlParser: true},{ useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

/* This code is defining a Mongoose model called "Post" using the postSchema. The model represents a
collection in the MongoDB database called "posts". */
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({})
  .then(function (composts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: composts
      });
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

/* This code is defining a route for handling GET requests to the "/contact" route. When a user
navigates to the "/contact" route in their browser, this code will be executed. It renders the
"contact" view using the EJS template engine and passes the contactContent variable as a parameter
to the view. This allows the contactContent variable to be accessed and displayed in the contact
view. */
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

/* `app.get("/compose", function(req, res){...})` is defining a route for handling GET requests to the
"/compose" route. When a user navigates to the "/compose" route in their browser, this code will be
executed. */
app.get("/compose", function(req, res){
  res.render("compose");
});

/* This code is handling a POST request to the "/compose" route. When a user submits a form with a post
title and content, this code retrieves the values from the request body using `req.body.postTitle`
and `req.body.postBody`. It then creates a new `Post` object with the title and content, and saves
it to the database using `postcontent.save()`. Finally, it redirects the user back to the home page
("/") using `res.redirect("/")`. */
app.post("/compose", function(req, res){
  
  var titlePost = req.body.postTitle;
  var contentPost = req.body.postBody;

  console.log(titlePost);
  console.log(contentPost);

  const post = {
    title: req.body.postTitle,
    content: req.body.postBody  
  };

  const postcontent = new Post({
    title : _.capitalize(titlePost),
    content : contentPost
  })

  postcontent.save();
  res.redirect("/");

});

/* This code is defining a route for handling requests to view a specific blog post. The route is
defined as "/posts/:postName", where ":postName" is a parameter that represents the title of the
blog post. */
app.get("/posts/:postName", function(req, res){
  const requestedTitle = (req.params.postName);

  Post.findOne({title: requestedTitle})
  .then(function(compost){
    res.render("post", {title:_.capitalize(compost.title), content:compost.content});
  })

});

/* `app.listen(3000, function() {
  console.log("Server started on port 3000");
});` is starting the server and listening for incoming requests on port 3000. When the server starts
successfully, it will log the message "Server started on port 3000" to the console. */
let port = process.env.PORT

if (port === null || port === "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port Heroku");
});
