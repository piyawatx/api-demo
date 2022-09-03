const express = require("express");
const cors = require("cors");

const path = require("path");
const fs = require('fs');   
fs.mkdir(path.join(__dirname, 'images'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
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
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    var myobj = {
      title: product.title,
      price: product.price,
      image: product.image,
      imageUrl: product.imageUrl,
    };
    dbo.collection("products").insertOne(myobj, function (err, result) {
      if (err) throw err;
      // console.log(result.insertedId.toString());
      res.send(result.insertedId.toString());
      db.close();
    });
  });
});

app.put("/products/update", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    var myquery = { _id: ObjectId(req.body.id) };
    var newvalues = {
      $set: {
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        imageUrl: req.body.imageUrl,
      },
    };
    dbo
      .collection("products")
      .updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        res.send("1 document updated");
        db.close();
      });
  });
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("imagez"), (req, res) => {
  console.log("req.file", req.file);
  res.send(req.file);
});

app.get("/image/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, "./images", req.params.filename));
});
