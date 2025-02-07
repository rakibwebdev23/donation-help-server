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
    const usersCollection = client.db("crowdFundingDB").collection("users");
    const contactCollection = client.db("crowdFundingDB").collection("contact");


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
    app.get("/donation/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await donationDataCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/donation", async (req, res) => {
      const donation = req.body;
      const result = await donationDataCollection.insertOne(donation);
      res.send(result);
    });

    app.delete("/donation/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await donationDataCollection.deleteOne(query);
      res.send(result);
    });

    // user related api 
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User Already exist", insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // contact related api 
    app.post("/contact", async (req, res) => { 
      const message = req.body;
      const result = await contactCollection.insertOne(message);
      res.send(result);
    });

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