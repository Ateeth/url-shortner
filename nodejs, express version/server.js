const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

const app = express();
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost/urlShortener", {});
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({
    fullUrl: req.body.fullUrl,
  });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const url = req.params.shortUrl;
  const record = await ShortUrl.findOne({
    shortUrl: url,
  });

  if (record == null) {
    return res.sendStatus(404);
  }

  record.clicks++;
  record.save();

  res.redirect(record.fullUrl);
});

app.listen(process.env.PORT | 5000);
