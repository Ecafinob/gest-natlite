const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8"]);
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connecté avec succès");
    }catch(error){
        console.error("Erreur de connexion MongoDB",error.message);
        process.exit(1)
    }
}

module.exports = connectDB;


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://gestAdmin:<db_password>@gestionnatalite.cuany9l.mongodb.net/?appName=GestionNatalite";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
