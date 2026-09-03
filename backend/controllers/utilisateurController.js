const bcrypt = require("bcrypt");
const Utilisateur = require("../models/Utilisateur");

// Créer un utilisateur par un administrateur
const creerUtilisateur = async (req, res) => {
    try {
        const { nom, email, motDePasse, role } = req.body;

        //Vérifier les champs obligatoires
        if (!nom || !email || !motDePasse) {
            return res.status(400).json({
                message: "Le nom, l'email et le mot de passe sont obligatoire"
            });
        }
        // Vérifier si l'utilisateur existe déjà
        const utilisateurExiste = await Utilisateur.findOne({ email });

        if (utilisateurExiste) {
            return res.status(409).json({
                message: "Un utilisateur avec cet email existe déjà"
            });
        }

        //Le rôle par defaut est agent
        const roleUtilisateur = role || "agent";
        //vérifier que le rôle est valide
        if (!["admin", "agent"].includes(roleUtilisateur)) {
            return res.status(400).json({
                message: "Le rôle doit être admin ou agent"
            });
        }

        //Hacher le mot de passe 
        const motDePasseHash = await bcrypt.hash(motDePasse, 10);

        //créer l'utilisateur 
        const utilisateur = await Utilisateur.create({
            nom,
            email,
            motDePasse: motDePasseHash,
            role: roleUtilisateur
        });

        // Ne jamais retourner le mot de passe
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message:"Erreurs lors de la création de l'utilisateur"
        });
    }
};

//Obtenir tous les utilisateurs
const obtenirTousLesUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find()
        .select("-motDePasse")
        .sort({ createdAt: -1 });
        res.status(200).json({
            message: "Utilisateurs récupérés avec succès",
            utilisateurs
        });
    } catch (error) {
        console.error("Erreur de la récupération des utilisateurs:", 
        error
        );

        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs"
        });
    }
};

//obtenir les utilisateurs par id
const obtenirUtilisateurParId = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id).select("-motDePasse");

        if(!utilisateur) {
            return res.status(404).json({
                message:"Utilisateur non trouvé",
            });
        }
        res.status(200).json({
            message:"Utilisateur récupéré avec succès",
            utilisateur
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur");
        res.status(500).json({
            message:"Erreur lors de la récupération de l'utilisateur"
        });
    }
};

// Modifier un utilisateur
const modifierUtilisateur = async (req, res) => {
    try {
        const { nom, email, motDePasse, role } = req.body;

        // Rechercher l'utilisateur
        const utilisateur = await Utilisateur.findById(req.params.id);

        if (!utilisateur) {
            return res.status(404).json({
                message: "Utilisateur non trouvé"
            });
        }

        // Modifier le nom
        if (nom) {
            utilisateur.nom = nom;
        }

        // Modifier l'email
        if (email) {
            const emailExiste = await Utilisateur.findOne({
                email,
                _id: { $ne: req.params.id }
            });

            if (emailExiste) {
                return res.status(409).json({
                    message: "Cet email est déjà utilisé"
                });
            }

            utilisateur.email = email;
        }

        // Modifier le rôle
        if (role) {
            if (!["admin", "agent"].includes(role)) {
                return res.status(400).json({
                    message: "Le rôle doit être admin ou agent"
                });
            }

            utilisateur.role = role;
        }

        // Modifier le mot de passe
        if (motDePasse) {
            utilisateur.motDePasse = await bcrypt.hash(
                motDePasse,
                10
            );
        }

        await utilisateur.save();

        res.status(200).json({
            message: "Utilisateur modifié avec succès",
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });

    } catch (error) {
        console.error(
            "Erreur lors de la modification de l'utilisateur :",
            error
        );

        res.status(500).json({
            message: "Erreur lors de la modification de l'utilisateur"
        });
    }
};

// Supprimer un utilisateur
const supprimerUtilisateur = async (req, res) => {
    try {
        // Rechercher l'utilisateur à supprimer
        const utilisateur = await Utilisateur.findById(req.params.id);

        if (!utilisateur) {
            return res.status(404).json({
                message: "Utilisateur non trouvé"
            });
        }

        // Empêcher l'utilisateur de supprimer son propre compte
        if (utilisateur._id.toString() === req.utilisateur.id) {
            return res.status(400).json({
                message: "Vous ne pouvez pas supprimer votre propre compte"
            });
        }

        // Si l'utilisateur à supprimer est un administrateur
        if (utilisateur.role === "admin") {

            // Compter le nombre total d'administrateurs
            const nombreAdmins = await Utilisateur.countDocuments({
                role: "admin"
            });

            // Empêcher la suppression du dernier administrateur
            if (nombreAdmins <= 1) {
                return res.status(400).json({
                    message: "Impossible de supprimer le dernier administrateur"
                });
            }
        }

        // Supprimer l'utilisateur
        await Utilisateur.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Utilisateur supprimé avec succès"
        });

    } catch (error) {
        console.error(
            "Erreur lors de la suppression de l'utilisateur :",
            error
        );

        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur"
        });
    }
};


module.exports = {
    creerUtilisateur,
    obtenirTousLesUtilisateurs,
    obtenirUtilisateurParId,
    modifierUtilisateur,
    supprimerUtilisateur
};