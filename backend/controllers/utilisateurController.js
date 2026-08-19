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

module.exports = {
    creerUtilisateur,
    obtenirTousLesUtilisateurs
};