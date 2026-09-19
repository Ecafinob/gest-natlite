require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const app = require("./app");
const connectDB = require("./config/db");

// Vercel gere son propre port; cette valeur concerne uniquement le serveur local.
const PORT = process.env.PORT || 5000;

// La connexion est verifiee avant de demarrer le serveur HTTP.
connectDB().catch(() => process.exit(1));

app.listen(PORT, () =>{
    console.log(`Serveur démarré sur le port ${PORT}`)
});