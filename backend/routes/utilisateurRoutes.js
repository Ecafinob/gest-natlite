const express = require("express");

const router = express.Router();

const authentifierUtilisateur = require("../middleware/authMiddleware");
const autoriserRole = require("../middleware/roleMiddleware");

const {
    creerUtilisateur,
    obtenirTousLesUtilisateurs
} = require("../controllers/utilisateurController");

// POST - Créer un utilisateur
// Seul l'administrateur peut créer un utilisateur
router.post(
    "/",
    authentifierUtilisateur,
    autoriserRole("admin"),
    creerUtilisateur
);

// GET - Tous les utilisateurs
// Seul l'administrateur peut consulter la liste
router.get(
    "/",
    authentifierUtilisateur,
    autoriserRole("admin"),
    obtenirTousLesUtilisateurs
);
module.exports = router;