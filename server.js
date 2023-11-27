const dotenv = require('dotenv')
dotenv.config();

const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const DB_URL = process.env.MONGODB_URI

const client = new MongoClient(DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// Express Routes
app.get('/', async (req, res) => {
  await client.db("Cluster0").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  res.send('Welcome to my app!');
});

app.get('/find-nursing-room', async (req, res) => {
  // Parse query params
  const mallSearch = req.query.mallSearch 
  console.log("any mall", mallSearch)

  // Fetch data from MongoDB
  const collection = client.db("nursingdatabase").collection("nursingdatabase")
  const cursor = collection.find({ "Mall": {$regex: mallSearch, $options: "i"} })
  const allValues = await cursor.toArray()


  res.json({ data: allValues});
});



// const Mall = require('./mall'); // Adjust the path based on your project structure

// Example route using the Mall model
// app.get('/search', async (req, res) => {
//   const searchTerm = req.query.q;
//   const results = await Mall.find({ Mall: { $regex: new RegExp(searchTerm, 'i') } });
//   res.json(results);
// });


// Additional routes for search functionality

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});