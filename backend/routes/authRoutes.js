const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();

// POST - Inscription
router.post("/register", register);

// POST - Connexion
router.post("/login", login);

module.exports = router;