const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoClient = require("mongodb").mongoClient;
const port = process.env.PORT || 3030;
require("dotenv").config();

MongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true })
  .then((client) => {
    console.log("connet");

    const db = client.db("start-wars-quote");
    const quotesCollection = db.collection("quotes");
    // ========================
    // Middlewares
    // ========================
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(bodyParser.json());

    // ========================
    // Middlewares
    // ========================
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((result) => {
          res.render("index.ejs", { quotes: result });
        })
        .catch(console.error);
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/");
        })
        .catch((error) => console.log(error));
    });
    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((e) => console.error(e));
    });
    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          return res.json("Deleting Dark Varth quotes");
        })
        .catch((e) => console.error(e));
    });
    app.listen(port, function () {
      console.log("listening on 3030");
    });
  })
  .catch(console.error);
