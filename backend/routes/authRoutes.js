const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();

// Ces routes sont publiques: elles creent un compte ou ouvrent une session.
// POST - Inscription
router.post("/register", register);

// POST - Connexion
router.post("/login", login);

module.exports = router;