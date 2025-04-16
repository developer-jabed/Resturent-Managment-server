const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, Collection, ObjectId  } = require('mongodb');
require('dotenv').config();


// DB_PASS = uZ58gV6icYZctwVz



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xo1yp.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const foodsCollection = client.db('Resturent-managment').collection('Foods-collection');


    app.get('/Foods-collection', async(req, res) => {
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
    

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Resturent server is Running')
})

app.listen(port, () => {
    console.log(`ORder is waiting At : ${port}`)
})