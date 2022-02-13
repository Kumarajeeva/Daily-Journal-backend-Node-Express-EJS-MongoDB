const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent1 = "Contemporary climate change includes both global warming and its impacts on Earth's weather patterns. There have been previous periods of climate change, but the current changes are distinctly more rapid and not due to natural causes.Instead, they are caused by the emission of greenhouse gases, mostly carbon dioxide (CO2) and methane. Burning fossil fuels for energy use creates most of these emissions. Agriculture, steelmaking, cement production, and forest loss are additional sources.As human behavior and choices destabilize the Earth’s climate and biosphere, policymakers will need to do more. The shared nature of the threat also shows the need for closer and more comprehensive international cooperation to preserve the habitat in which human life has thrived.";
const homeStaringContent2 = "Extinction is the termination of a kind of organism or of a group of kinds (taxon), usually a species. The moment of extinction is generally considered to be the death of the last individual of the species, although the capacity to breed and recover may have been lost before this point. Because a species' potential range may be very large, determining this moment is difficult, and is usually done retrospectively. This difficulty leads to phenomena such as Lazarus taxa, where a species presumed extinct abruptly 'reappears' (typically in the fossil record) after a period of apparent absence."
const aboutContent = "This is a daily journal website with published contents about the happenings in the world. Users can compose or insert a new blog. The new composed blogs are published in the home page. Click compose and start writing new blogs!";
const contactContent = "For enquires and doubts, reach out to us though email at abc123@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema={
  title: String,
  content: String
};

const Post=mongoose.model("Post", postSchema);



app.get("/", function(req, res){

  Post.find({},function(err,posts){
    res.render("home", {startingContent1: homeStartingContent1,startingContent2: homeStaringContent2, posts: posts});
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    } else {console.log(err)};
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err,posts){
    res.render("post", {title: posts.title, content: posts.content });
  });

});

let port=process.env.PORT;
if(port==null||port==""){
  port=3000;
}

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
