const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://admin:1234@cluster0.gj9iluf.mongodb.net/?retryWrites=true&w=majority";
var ObjectId = require("mongodb").ObjectId;

app.get("/products", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    dbo
      .collection("products")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
        db.close();
      });
  });
});

app.get("/products/:id", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    dbo
      .collection("products")
      .findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
        if (err) throw err;
        res.send(result);
        db.close();
      });
  });
});

app.post("/products/create", (req, res) => {
  let product = req.body;
  console.log(req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    var myobj = {
      title: product.title,
      price: product.price,
      image: product.image,
    };
    dbo.collection("products").insertOne(myobj, function (err, result) {
      if (err) throw err;
      res.send("1 document inserted");
      db.close();
    });
  });
});

app.put("/products/update", (req, res) => {
  res.send("Hello World!");
});

app.delete("/products/delete", (req, res) => {
  console.log("id = ", req.body.id);

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    var myquery = { _id: ObjectId(req.body.id) };
    dbo.collection("products").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      res.send(obj);
      db.close();
    });
  });
});
