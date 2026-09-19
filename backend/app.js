const express = require("express");
const cors = require("cors");
const path = require("path");

const naissanceRoutes = require("./routes/naissanceRoutes");
const authRoutes = require("./routes/authRoutes");
const utilisateurRoutes = require("./routes/utilisateurRoutes");

const app = express();

// Autorise les appels depuis le frontend et parse les corps JSON.
app.use(cors());
app.use(express.json());

// En local, Express sert directement les fichiers de l'interface.
app.use(express.static(path.join(__dirname, "../frontend")));

// Chaque routeur regroupe les endpoints d'un domaine fonctionnel.
app.use("/naissances", naissanceRoutes);
app.use("/auth/", authRoutes);
app.use("/utilisateurs", utilisateurRoutes);

// Point de contrôle simple pour verifier que l'API est disponible.
app.get("/", (req, res) => {
    res.json({
        message: "API Gestion de la Natalité opérationnelle"
    });
});


module.exports = app;