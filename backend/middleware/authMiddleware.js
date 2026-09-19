const jwt = require("jsonwebtoken");

const authentifierUtilisateur = (req, res, next) => {
    try {
        // Le frontend envoie les tokens sous la forme: Authorization: Bearer <token>.
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

        // Le payload decode est conserve pour les controles de role et les controllers.
        const utilisateur = jwt.verify(
            token,
            process.env.JWT_SECRET?.trim()
        );
        req.utilisateur = utilisateur;
        next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Token invalide ou expiré"
        });
    }
};

module.exports = authentifierUtilisateur;