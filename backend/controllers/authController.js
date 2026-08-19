const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/Utilisateur");

// Inscription
const register = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        // Vérifier les champs obligatoires
        if (!nom || !email || !motDePasse) {
            return res.status(400).json({
                message: "Le nom, l'email et le mot de passe sont obligatoires"
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const utilisateurExiste = await Utilisateur.findOne({ email });

        if (utilisateurExiste) {
            return res.status(409).json({
                message: "Un utilisateur existe déjà"
            });
        }

        // Hacher le mot de passe
        const motDePasseHash = await bcrypt.hash(motDePasse, 10);

        // Créer l'utilisateur
        const utilisateur = await Utilisateur.create({
            nom,
            email,
            motDePasse: motDePasseHash
        });

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
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la création de l'utilisateur"
        });
    }
};


// Connexion
const login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérifier les champs
        if (!email || !motDePasse) {
            return res.status(400).json({
                message: "L'email et le mot de passe sont obligatoires"
            });
        }

        // Rechercher l'utilisateur
        const utilisateur = await Utilisateur.findOne({ email });

        if (!utilisateur) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // Comparer le mot de passe
        const motDePasseCorrect = await bcrypt.compare(
            motDePasse,
            utilisateur.motDePasse
        );

        if (!motDePasseCorrect) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            {
                id: utilisateur._id,
                role: utilisateur.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token,
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la connexion"
        });
    }
};


module.exports = {
    register,
    login,
    
};