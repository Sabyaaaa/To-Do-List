
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

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

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


}); app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                // console.log("Dosen't exist!");

                //Create a new list.
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            } else {
                // console.log("Exists!");

                //Show an existing list.
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });

});



app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    //mongoose doc.
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Removed successfully!");
                res.redirect("/");

            }
        });

    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
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