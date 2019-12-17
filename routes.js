var db = require("./models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/scrape", function(req, res) {
    axios.get("https://www.insidescience.org/earth").then(function(response) {
      var $ = cheerio.load(response.data);

      $(".field-title").each(function(i, element) {
        // empty result object
        var result = {};
        console.log(i);
        result.title = $(this)
          .children("h2")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        console.log(result);
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            res.redirect("/");
          })
          .catch(function(err) {
            res.json(err);
          });
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
};
