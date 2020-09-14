
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// console.log(date());

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
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

app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {

        // console.log(foundItems);

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sucessfully inserted the items!");
                }
            });
            res.redirect("/");  //It helps to make the insert items visible onto our browser.

        } else {

            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });


});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;

    //mongoose doc.
    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");

});

app.post("/delete", function(req, res) {
   const checkedItemId = req.body.checkbox;

   Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Removed successfully!");
      res.redirect("/");

    }
  });
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