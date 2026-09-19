const autoriserRole = (...rolesAutorises) => {
    return (req, res, next) =>{
        // Ce middleware s'utilise apres authentifierUtilisateur.
        if (!req.utilisateur) {
            return res.status(401).json({
                message: "Utilisateur non authentifié"
            });
        }

        // Le role est issu du JWT signe, puis compare aux roles de la route.
        if (!rolesAutorises.includes(req.utilisateur.role)) {
            return res.status(403).json({
                message:"Accès interdit: vous n'avez pas les droits nécessaires"
            });
        }
        next();
    };
};

module.exports = autoriserRole;