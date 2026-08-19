const express = require("express");
const cors = require("cors");

const naissanceRoutes = require("./routes/naissanceRoutes");
const authRoutes = require("./routes/authRoutes");
const utilisateurRoutes = require("./routes/utilisateurRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes des naissances
app.use("/api/naissances", naissanceRoutes);
//Routes des authentifications
app.use("/api/auth/", authRoutes);
//route des utilisateurs
app.use("/api/utilisateurs", utilisateurRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "API Gestion de la Natalité opérationnelle"
    });
});


module.exports = app;