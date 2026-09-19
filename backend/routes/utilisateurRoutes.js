const express = require("express");

const router = express.Router();

const authentifierUtilisateur = require("../middleware/authMiddleware");
const autoriserRole = require("../middleware/roleMiddleware");

const {
    creerUtilisateur,
    obtenirTousLesUtilisateurs,
    obtenirUtilisateurParId,
    modifierUtilisateur,
    supprimerUtilisateur
} = require("../controllers/utilisateurController");

// Toutes les operations de gestion des comptes sont reservees aux administrateurs.
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
    obtenirTousLesUtilisateurs);

    // GET - Utilisateur par ID
// Admin uniquement
router.get(
    "/:id",
    authentifierUtilisateur,
    autoriserRole("admin"),
    obtenirUtilisateurParId
);

// PUT - Modifier un utilisateur
// Admin uniquement
router.put(
    "/:id",
    authentifierUtilisateur,
    autoriserRole("admin"),
    modifierUtilisateur
);

// DELETE - Supprimer un utilisateur
// Admin uniquement
router.delete(
    "/:id",
    authentifierUtilisateur,
    autoriserRole("admin"),
    supprimerUtilisateur
);

module.exports = router;