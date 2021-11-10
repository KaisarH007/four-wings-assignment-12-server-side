const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7000;

//Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7gwaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("fourWings");
    const productsCollection = database.collection("products");
    const orderedProductsCollection = database.collection("orderedProducts");

    //Get products from DB
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.limit(6).toArray();
      res.send(products);
      console.log(products);
    });
    app.get("/exploreAllProducts", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
      console.log(products);
    });

    //Post New Package  to DB
    app.post("/addProducts", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.send(result);
    });

    // //Get product info by id API
    app.get("/productInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    //Post orderd Package to DB

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderedProductsCollection.insertOne(order);
      res.send(result);
      console.log(order, result);
    });

    // //Get orderd Package from DB
    // app.get("/bookedPackages", async (req, res) => {
    //   const cursor = bookedPackageCollection.find({});
    //   const bookedPackages = await cursor.toArray();
    //   // console.log(bookedPackages);
    //   res.send(bookedPackages);
    // });

    // //Delete Booked Orders from Bookedpackage
    // app.delete("/bookedPackages/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await bookedPackageCollection.deleteOne(query);
    //   res.send(result);
    // });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//test
app.get("/", (req, res) => {
  res.send("Assignment-12 server is running");
});

app.listen(port, () => {
  console.log("port is running ", port);
});
