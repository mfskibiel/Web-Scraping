const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

var db = require("./models");

var PORT = 3030;

const app = express();

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes.js");

mongoose.connect("mongodb://localhost/scienceWebScraping", {
  useNewUrlParser: true
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
