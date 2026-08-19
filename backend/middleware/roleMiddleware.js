const autoriserRole = (...rolesAutorises) => {
    return (req, res, next) =>{
        
        console.log("Utilisateur reçu par roleMiddleware :", req.utilisateur);

        if (!req.utilisateur) {
            return res.status(401).json({
                message: "Utilisateur non authentifié"
            });
        }

        if (!rolesAutorises.includes(req.utilisateur.role)) {
            return res.status(403).json({
                message:"Accès interdit: vous n'avez pas les droits nécessaires"
            });
        }
        next();
    };
};

module.exports = autoriserRole;