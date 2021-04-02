const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const app = express();
const connectionString =
  "mongodb+srv://Yoda:TheForce@cluster0.ndnfb.mongodb.net/test?retryWrites=true&w=majority";

//set up ejs engine1
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Make the public folder accessible(public)
app.use(express.static(__dirname + "/public"));

//tell server how to read json data
// app.use(bodyParser.json());

const main = {
  init() {
    this.createServer();
    this.getFormData();
    this.connectToMongo();
    //this.getIndex();
    //this.createQuote();
  },

  createServer() {
    app.listen(3000, () => {
      console.log("Listening on port 3000...");
    });
  },
  // The url encoded method extract all data from form and adds it to the body of the req object.
  getFormData() {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
  },
  connectToMongo() {
    MongoClient.connect(connectionString, { useUnifiedTopology: true })
      .then((client) => {
        console.log("Connected To Database!");
        const db = client.db("star-wars");
        const quotesCollection = db.collection("quotes");

        this.createQuote(quotesCollection);
        this.getIndex(db);
        this.changeQuote(quotesCollection);
        this.deleteQuote(quotesCollection);
      })
      .catch(console.error);
  },

  // This method returns the home page of our app(index.html)
  getIndex(db) {
    app.get("/", (req, res) => {
      //res.sendFile(__dirname + "/index.html");
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index", { quotes: results });
        })
        .catch((error) => console.error(error));
    });
  },
  createQuote(collection) {
    app.post("/quotes", (req, res) => {
      collection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
  },
  changeQuote(quotesCollection) {
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
            // if no Yoda quotes exist, then write a new darth vader quote
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.error(error));
    });
  },

  deleteQuote(quotesCollection) {
    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vadar's quote`);
        })
        .then((response) => {
          if (response === "No quote to delete") {
            messageDiv.textContent = "No Darth Vadar quote to delete";
          } else {
            window.location.reload(true);
          }
        })
        .catch((error) => console.error(error));
    });
  },
};

main.init();
