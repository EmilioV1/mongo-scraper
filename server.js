//Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require('body-parser')


//Set up our port to be host or 3000
var PORT = process.env.PORT || 3000;

//Instantiates Express App
var app = express();

//Set up Express Router
var router = express.Router();

//Require our routes file is passed the router object
require("./config/routes")(router);

//Designates public folder as a static directory
app.use(express.static(__dirname + "/public"));

//Connects Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//Use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

//Has every request go through our router middleware
app.use(router);

//If deployed, uses deployed db, otherwise use local mongoHeadlines db
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//Connect mongoose to our db
mongoose.connect(db, function (error) {
    //Log any errors connecting to mongoose
    if (error) {
        console.log(error);
    } 
    //Or log a success message
    else {
        console.log("mongoose connection is successful.");
    }
});

//Listen on the port
app.listen(PORT, function () {
    console.log("Listening on port:" + PORT);
});