require("dotenv").config();

const app = require("../backend/app");
const connectDB = require("../backend/config/db");

let databaseConnection;

module.exports = async (req, res) => {
    try {
        // La promesse est partagee entre les invocations chaudes de la fonction serverless.
        databaseConnection ||= connectDB();
        await databaseConnection;

        // Vercel routes /api/* to this function while Express owns the routes without /api.
        if (req.url === "/api") {
            req.url = "/";
        } else if (req.url.startsWith("/api/")) {
            req.url = req.url.slice(4);
        }

        return app(req, res);
    } catch (error) {
        console.error("Erreur de connexion MongoDB:", error);
        return res.status(500).json({ message: "Base de données indisponible" });
    }
};
