const express = require("express");
const cors = require("cors");
const naissanceRoutes = require("./routes/naissanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API Gestion de la Natalité opérationnelle"
    });
});

// Routes des naissances
app.use("/api/naissances", naissanceRoutes);

module.exports = app;