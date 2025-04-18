require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(
  cors({
    origin: ["https://resturent-managment.web.app", "http://localhost:5173"],
    credentials: true,
  })
);

// continue with your existing code...

app.use(cookieParser());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xo1yp.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    const foodsCollection = client
      .db("Resturent-managment")
      .collection("Foods-collection");

    const purchaseCollection = client
      .db("Resturent-managment")
      .collection("Purchases");
    const userCollection = client.db("Resturent-managment").collection("users");

    app.post("/purchase", async (req, res) => {
      const purchase = req.body;
      const result = await purchaseCollection.insertOne(purchase);
      res.status(200).send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("creating new user ", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.post("/jwt", async (req, res) => {
      const { email } = req.body;
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true, // must be true for cross-origin cookies
          sameSite: "none",
        })
        .send({ success: true });
    });

    app.post("/Foods-collection", async (req, res) => {
      try {
        const newFood = req.body;
        const result = await foodsCollection.insertOne(newFood);
        res.send(result);
      } catch (error) {
        console.error("Error inserting food:", error);
        res.status(500).send({ error: "Failed to insert food item." });
      }
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

    app.delete("/purchase/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const result = await purchaseCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 1) {
          res.send({ message: "Order deleted" });
        } else {
          res.status(404).send({ error: "Order not found" });
        }
      } catch (error) {
        console.error("Delete error:", error);
        res.status(500).send({ error: "Failed to delete order" });
      }
    });

    app.put("/Foods-collection/:id", async (req, res) => {
      const { id } = req.params;
      const updatedFood = req.body;

      try {
        const updateQuery = {};
        const setFields = {};
        const incrementFields = {};

        for (const key in updatedFood) {
          if (
            key !== "decrementCount" &&
            key !== "incrementPurchaseCount" &&
            key !== "incrementCount"
          ) {
            setFields[key] = updatedFood[key];
          }
        }

        if (updatedFood.decrementCount) {
          incrementFields.quantity = -parseInt(updatedFood.decrementCount);
        }

        if (updatedFood.incrementPurchaseCount || updatedFood.incrementCount) {
          incrementFields.purchaseCount = parseInt(
            updatedFood.incrementPurchaseCount || updatedFood.incrementCount
          );
        }

        if (Object.keys(setFields).length > 0) {
          updateQuery.$set = setFields;
        }
        if (Object.keys(incrementFields).length > 0) {
          updateQuery.$inc = incrementFields;
        }

        const result = await foodsCollection.updateOne(
          { _id: new ObjectId(id) },
          updateQuery
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
      const query = { _id: new ObjectId(id) };
      const result = await foodsCollection.findOne(query);
      res.send(result);
    });

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
    // Optional: close MongoDB connection
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.json({ message: "Resturent server is Running" });
});

app.listen(port, () => {
  console.log(`ORder is waiting At : ${port}`);
});
