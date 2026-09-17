const express = require("express");
const cors = require("cors");
const path = require("path");

const naissanceRoutes = require("./routes/naissanceRoutes");
const authRoutes = require("./routes/authRoutes");
const utilisateurRoutes = require("./routes/utilisateurRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes des naissances
app.use("/naissances", naissanceRoutes);
//Routes des authentifications
app.use("/auth/", authRoutes);
//route des utilisateurs
app.use("/utilisateurs", utilisateurRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "API Gestion de la Natalité opérationnelle"
    });
});


module.exports = app;