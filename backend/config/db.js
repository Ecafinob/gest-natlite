const mongoose = require("mongoose");
const dns = require("dns");

// Utilise un DNS stable dans certains environnements qui resolvent mal les URLs SRV MongoDB.
dns.setServers(["8.8.8.8"]);
const connectDB = async () =>{
    try{
        // MONGO_URI est fourni par backend/.env en local ou par Vercel en production.
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connecté avec succès");
    }catch(error){
        console.error("Erreur de connexion MongoDB",error.message);
        throw error;
    }
}

module.exports = connectDB;


