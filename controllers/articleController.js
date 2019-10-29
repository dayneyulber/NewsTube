var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var router = express.Router();


var db = require("../models/");


router.get("/", function(req, res) {
  db.Article.find({}, null, {sort: {date: -1}})
  .then(function(dbArticles) {
    var hbs = dbArticles;
    res.render("index", hbs);
  });
});


router.get("/article/:id", function(req, res) {
  db.Article.find({_id: req.params.id})
  .populate("comments")
  .then(function(dbArticles) {
    var hbs = { articles: dbArticles };
    res.render("index", hbs);
  });
});


router.post("/api/scrape", function(req, res) {

  axios.get("https://www.rotowire.com/football/articles.php").then(function(response) {


    var $ = cheerio.load(response.data);


    var articles = [];

    $(".content-preview__title").each(function(i, element) {

      var title = $(element).text().trim().split("\r")[0];
      var link = "http://www.rotowire.com" + $(element).attr("href");
      var text = $(element).parent().nextAll(".content-preview__desc").text();
      

      var article = new db.Article();
      article.title = title;
      article.text = text;
      article.link = link;
      articles.push(article);
    });

    db.Article.insertMany(articles)

    .then(function(dbArticles) {
      res.json(dbArticles);
    }).catch(function(err) {

      res.json(err);
    });
  });
});


router.post("/api/article/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      db.Article.findOneAndUpdate(
        {_id: req.params.id},
        {$push: {comments: dbComment}})
        .then(function(dbArticle) {
          res.json(dbArticle);
        }).catch(function(err) {
          res.json(err);
        });
    });
});

module.exports = router;