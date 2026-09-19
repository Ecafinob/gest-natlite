require("dotenv").config();

const app = require("../../backend/app");
const connectDB = require("../../backend/config/db");

let databaseConnection;

module.exports = async (req, res) => {
    try {
        databaseConnection ||= connectDB();
        await databaseConnection;

        // Express utilise /utilisateurs, sans le prefixe Vercel /api.
        if (req.url.startsWith("/api/")) {
            req.url = req.url.slice(4);
        }

        return app(req, res);
    } catch (error) {
        console.error("Erreur de connexion MongoDB:", error);
        return res.status(500).json({
            message: "Base de données indisponible",
            detail: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
