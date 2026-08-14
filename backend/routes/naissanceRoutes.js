const express = require("express");

const router = express.Router();
const {creerNaissance,
    obtenirToutesLesNaissances,
    obtenirNaissanceParId,
    modifierNaissance,
    supprimerNAissance
} = require("../controllers/naissanceController");

//POST-enregistrer une naissance
router.post("/", creerNaissance);

//GET- Toutes les naissances
router.get("/", obtenirToutesLesNaissances);

//GET- une naissance par id
router.get("/:id", obtenirNaissanceParId);

//PUT- Modifier la naissance
router.put("/:id", modifierNaissance);

//DELETE- supprimer la naissance
router.delete("/:id", supprimerNAissance);
module.exports = router;





//Enregistrement d'une nouvelle naissance
// router.post("/", async (req, res) =>{
//     try{
//         const naissance = new Naissance(req.body);
//         const nouvelleNaissance = await naissance.save();
//         res.status(201).json({
//             message:"Naissance enregistrée avec succès",
//             naissance: nouvelleNaissance
//         });
//     }catch(error){
//         res.status(500).json({
//             message:"Erreur lors de l'enregistrement",
//             error: error.message
//         });
//     }
// });