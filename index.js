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
    const customerReviewsCollection = database.collection("customerReviews");

    //Get limited products from DB
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.limit(6).toArray();
      res.send(products);
      console.log(products);
    });
    //Get All products from DB
    app.get("/exploreAllProducts", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
      console.log(products);
    });

    //Post New Products  to DB
    app.post("/addProducts", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.send(result);
    });

    // //Get product info by id
    app.get("/productInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    //Post ordered products to DB

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderedProductsCollection.insertOne(order);
      res.send(result);
      console.log(order, result);
    });

    // //Get ordered products from DB
    app.get("/orders", async (req, res) => {
      const cursor = orderedProductsCollection.find({});
      const result = await cursor.toArray();

      res.send(result);
    });
    //Get order by user email
    app.get("/myOrders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log(email);
      const cursor = orderedProductsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Post customers reviews to DB
    app.post("/addReviews", async (req, res) => {
      const reviews = req.body;
      const result = await customerReviewsCollection.insertOne(reviews);
      res.send(result);
    });

    //get customer reviews from DB
    app.get("/reviews", async (req, res) => {
      const cursor = customerReviewsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //Delete Booked Orders from orderedProductsCollection
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderedProductsCollection.deleteOne(query);
      res.send(result);
    });
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
