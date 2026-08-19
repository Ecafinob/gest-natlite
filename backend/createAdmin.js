require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const Utilisateur = require("./models/Utilisateur");

const creerAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connecté");

        const email = "admin@getMaxListeners.com";
        const motDePasse = "Admin123";
        
        //Vérifier si l'admin existe déjà
        const adminExiste = await Utilisateur.findOne({ email });

        if (adminExiste) {
            console.log("Cet administrateur existe déjà");
            return;
        }

        //Hacher le mot de passe
        const motDePasseHash = await bcrypt.hash(motDePasse, 10);

        //créer l'administrateur
        const admin = await Utilisateur.create({
            nom: "Administrateur",
            email,
            motDePasse: motDePasseHash,
            role: "admin"
        });
    } catch (error) {
        console.error("Erreur:", error);
    }finally {
        await mongoose.disconnect();
    }
};

creerAdmin();