const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const connectionString = "mongodb+srv://Yoda:TheForce@cluster0.ndnfb.mongodb.net/test?retryWrites=true&w=majority";

const main = {
    init() {
        this.createServer();
        this.getFormData();
        this.connectToMongo();
        this.getIndex();
        this.createQuote();
    },

    createServer() {
        app.listen(3000, () => {
            console.log("Listening on port 3000...");
        });
    },
    // The url encoded method extract all data from form and adds it to the body of the req object.
    getFormData() {
        app.use(bodyParser.urlencoded({ extended:true }));
    },
    // This method returns the home page of our app(index.html)
    getIndex() {
        app.get("/", (req, res) => {
            //res.send("This text is sent by the server back to this browser :)");
            res.sendFile(__dirname + "/index.html");
        });
    },
    createQuote() {
        app.post("/quotes", (req, res) => {
            res.send("Created The Quote!");
            console.log(req.body);
        });
    },
    connectToMongo() {
        MongoClient.connect(connectionString, { useUnifiedTopology: true } ,(err, client) => {
            if (err) return console.error(err);
            console.log("Connected To Database!");
            const db = client.db('star-wars-quotes')
        });
    }

}


main.init();