const jwt = require("jsonwebtoken");

const authentifierUtilisateur = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token d'authentification manquant"
            });
        }

       const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Format du token invalide"
            });
        }

        const utilisateur = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        console.log("utilisateur authentifié:", utilisateur)
        req.utilisateur = utilisateur;
        next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Token invalide ou expiré"
        });
    }
};

module.exports = authentifierUtilisateur;