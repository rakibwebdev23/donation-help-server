const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.712mjau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      
    const projectsDataCollection = client.db("crowdFundingDB").collection("projectsData");
    const donationDataCollection = client.db("crowdFundingDB").collection("donation");


    app.get("/projects", async (req, res) => {
      const result = await projectsDataCollection.find().toArray();
      res.send(result);
    });

    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await projectsDataCollection.findOne(query);
      res.send(result);
    });

    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectsDataCollection.insertOne(project);
      res.send(result);
    });

    // donation details api 
    app.post("/donation/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donationDataCollection.insertOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


      
app.get("/", async (req, res) => {
    res.send("Crowd funding project Server");
});

app.listen(port, () => {
    console.log(`crowd funding project server port are ${port}`);
})