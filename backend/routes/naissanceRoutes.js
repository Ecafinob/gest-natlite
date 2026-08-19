const express = require("express");

const router = express.Router();
const authentifierUtilisateur = require("../middleware/authMiddleware");
const {creerNaissance,
    obtenirToutesLesNaissances,
    obtenirNaissanceParId,
    modifierNaissance,
    supprimerNAissance,
    rechercherParNumeroActe
} = require("../controllers/naissanceController");
const autoriserRole = require("../middleware/roleMiddleware");

//POST-enregistrer une naissance
router.post("/", authentifierUtilisateur, autoriserRole("admin", "agent"), creerNaissance);

//GET- Toutes les naissances (route de consultation)
router.get("/", obtenirToutesLesNaissances);

//recherche par acte (route de consultation)
router.get("/numero-acte/:numeroActe", rechercherParNumeroActe);

//GET- une naissance par id (route de consultation)
router.get("/:id", obtenirNaissanceParId);

//PUT- Modifier la naissance
router.put("/:id", authentifierUtilisateur, autoriserRole("admin"), modifierNaissance);

//DELETE- supprimer la naissance
router.delete("/:id", authentifierUtilisateur, autoriserRole("admin"), supprimerNAissance);


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