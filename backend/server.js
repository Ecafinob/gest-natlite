require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const app = require("./app");
const connectDB = require("./config/db");


const PORT = process.env.PORT || 5000;
// console.log(process.env.MONGO_URI)
//connexion à mongodb
connectDB();

app.listen(PORT, () =>{
    console.log(`Serveur démarré sur le port ${PORT}`)
});