
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// console.log(date());

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/listDB", { useNewUrlParser: true });

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your to do list."
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function (req, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully saved to database!");
    }
});

app.get("/", function (req, res) {

    res.render("list", { listTitle: "Today", newListItems: items });
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