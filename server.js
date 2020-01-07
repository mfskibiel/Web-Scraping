const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://localhost/scienceWebScraping", {
  useNewUrlParser: true
});

//ROUTES

app.get("/scrape", function(req, res) {
  axios.get("https://www.insidescience.org/earth").then(function(response) {
    var $ = cheerio.load(response.data);

    $(".field-title h2 a").each(function(i, element) {
      var result = {};
      console.log(i);
      result.title = $(this).text();
      result.link = $(this).attr("href");
      console.log(result.title);

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          res.json(err);
        });

      res.send("it worked");
    });
  });
});

app.get("/clear", function(req, res) {
  db.Article.remove({})
    .then(function(dbArticle) {
      res.redirect("/");
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
