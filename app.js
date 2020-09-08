
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// console.log(date());

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {

    const day = date.getDate();

    res.render("list", { listTitle: day, newListItems: items });

});

app.post("/", function (req, res) {
    const item = req.body.newItem;
    console.log(item);

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        res.redirect("/");
    }

    items.push(item);

    res.redirect("/");

});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push[item];
    res.redirect("/work");
});

app.get("/about", function (req, res) {
    res.render("about", { listTitle: "Work List", newListItems: workItems })
})

app.listen(3000, function () {
    console.log("Server starts at 3000");
});