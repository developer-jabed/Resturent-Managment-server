const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const {
  MongoClient,
  ServerApiVersion,
  Collection,
  ObjectId,
} = require("mongodb");
require("dotenv").config();

// DB_PASS = uZ58gV6icYZctwVz

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xo1yp.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const foodsCollection = client
      .db("Resturent-managment")
      .collection("Foods-collection");

    const purchaseCollection = client
      .db("Resturent-managment")
      .collection("Purchases");

    app.post("/purchase", async (req, res) => {
      const purchase = req.body;

      const result = await purchaseCollection.insertOne(purchase);
      res.status(200).send(result);
    });

    app.get("/purchase", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) return res.status(400).send({ error: "Email is required" });
  
        const orders = await purchaseCollection
          .find({ buyerEmail: email })
          .toArray();
        res.send(orders);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch orders" });
      }
    });
    app.put("/Foods-collection/:id", async (req, res) => {
      const { id } = req.params;
      const updatedFood = req.body;

      try {
        // If incrementCount is sent from frontend, increase purchaseCount
        if (updatedFood.incrementCount) {
          const result = await foodsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { purchaseCount: updatedFood.incrementCount } }
          );

          if (result.modifiedCount > 0) {
            return res.send({
              message: "Purchase count updated successfully",
              modifiedCount: result.modifiedCount,
            });
          } else {
            return res.status(404).send({
              message: "Food item not found or no update made",
            });
          }
        }

        // Otherwise, update food fields normally
        const result = await foodsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedFood }
        );

        if (result.modifiedCount > 0) {
          res.send({
            message: "Food item updated successfully",
            modifiedCount: result.modifiedCount,
          });
        } else {
          res
            .status(404)
            .send({ message: "Food item not found or no changes made" });
        }
      } catch (error) {
        console.error("Error updating food item:", error);
        res.status(500).send({ message: "Failed to update food item", error });
      }
    });

    app.get("/Foods-collection", async (req, res) => {
      const cursor = foodsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/Foods-collection/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // <-- causes error if ObjectId not imported
      const result = await foodsCollection.findOne(query);
      res.send(result);
    });

    // Express.js route for deleting a food item
    app.delete("/Foods-collection/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await foodsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        console.error("Delete error:", error);
        res.status(500).send({ error: "Failed to delete food item." });
      }
    });


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Resturent server is Running");
});

app.listen(port, () => {
  console.log(`ORder is waiting At : ${port}`);
});
