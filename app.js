const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = ["Buy Momos", "Eat Momos", "Buy More Momos", "Eat More Momos"];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {

    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);

    res.render("list", { kindofDay: day, newListItem: items });

});

app.post("/", function(req, res) {
    var item = req.body.newItem;

    items.push(item);

    res.redirect("/");

});


app.listen(3000, function() {
    console.log("Server started at port 3000");
});