/** @format */

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// itJq9FYOiDSsi2JV

const uri =
  "mongodb+srv://asadurrahman:itJq9FYOiDSsi2JV@cluster0.0qkhitp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const artCollection = client.db("artCraftDB").collection("artCraft");
    app.get("/addArt", async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/myArt/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await artCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/addArt/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.findOne(query);
      res.send(result);
    });
    app.get("/art/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.findOne(query);
      res.send(result);
    });
    app.post("/addArt", async (req, res) => {
      const cards = req.body;
      const result = await artCollection.insertOne(cards);
      res.send(result);
      console.log(cards);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const art = req.body;
      const options = { upsert: true };
      const udpadedArt = {
        $set: {
          imgUrl: art.imgUrl,
          name: art.name,
          subcategory: art.subcategory,
          shortDes: art.shortDes,
          pric: art.pric,
          customaize: art.customaize,
          rate: art.rate,
          processTime: art.processTime,
          stock: art.stock,
        },
      };
      const result = await artCollection.updateOne(filter,udpadedArt,options);
      res.send(result)
    });

    app.delete('/myArt/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await artCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running now");
});
app.listen(port, () => {
  console.log(`server is running now on port ${port}`);
});
