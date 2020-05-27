const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");

//View engine
app.set("view engine", "ejs");

//Static
app.use(express.static("public"));

//Body-Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Connection
connection
    .authenticate()
    .then(() => {
        console.log("Connection stared successfully!");
    })
    .catch((error) => {
        console.log(error);
    })

//Routes
app.get("/", (req, res) => {
    res.render("index");
});

//Server
app.listen(8080, (error) => {
    if (error) {
        console.log("Error when starding the server! :(");
    }
    else{
        console.log("Server started successfully! :)");
    }
});