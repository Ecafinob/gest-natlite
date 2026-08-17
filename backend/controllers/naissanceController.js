const naissanceService = require("../services/naissanceService");
const generateNumeroActe = require("../utils/generateNumeroActe");
const mongoose = require("mongoose");

const creerNaissance = async (req, res) =>{
    try{
        const donnees = {
            ...req.body,
            numeroActe:generateNumeroActe()
        };
        console.log("Données envoyées au service :", donnees);

        const naissance = await naissanceService.creerNaissance(donnees);
        res.status(201).json({
            message:"Naissance enregistrée avec succès",
            naissance
        });
    }catch (error) {
        //gestion des doublons
        if(error.code === 11000){
            //409 signifie que la requête est correcte mais qu'elle entre en conflit avec une donnée existante
            return res.status(409).json({
                message:"Un acte de naissance avec ce numéro existe déjà"
            });
        }
        // Gestion des erreurs de validation
    if (error.name === "ValidationError") {
        return res.status(400).json({
            message: "Données invalides",
            erreurs: Object.values(error.errors).map(err => err.message)
        });
    }

    res.status(500).json({
        message: "Erreur interne du serveur",
        error: error.message
    });
}
};

//Récupérer toutes les naissances
const obtenirToutesLesNaissances = async (req, res) =>{
    try{
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const recherche = req.query.recherche || "" ;
      const resultat = await naissanceService.obtenirToutesLesNaissances(
        page,
        limit,
        recherche
      );
      res.status(200).json(resultat);
    }catch(error){
        console.error(error);

        res.status(500).json({
            message:"Erreur lors de la récupération des naissances",
        })
    }
};

//Récupérer les naissances par id
const obtenirNaissanceParId =async (req, res) =>{
    try{
        const naissance = await naissanceService.obtenirNaissanceParId(req.params.id);
        if (!naissance){
            return res.status(404).json({
                message:"Naissance introuvable"
            });
        }
        res.status(200).json({
            naissance
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message:"Erreur lors de la récupération de la naissance",
            error: error.message
        });
    }
};

//Modifier la naissance
const modifierNaissance = async (req, res) =>{
    try{
        const naissance = await naissanceService.modifierNaissance(req.params.id,
            req.body
        );
        if (!naissance){
           return res.status(404).json({
                message:"Naissance introuvable"
            });
        }
        res.status(200).json({
            message:"Naissance modifiée avec succès",
            naissance
        });   

    }catch(error){
       // gestion des doublons 
       if (error.code === 11000){
        return res.status(409).json({
            message: "Un acte de naissance avec ce numéro existe déjà"
        });
       }
       //gestion des erreurs de validation
       if (error.name === "ValidationError") {
        return res.status(400).json({
            message:"Données invalides",
            erreurs: Object.values(error.errors).map(err => err.message)
        });
       }

       //ID MongoDB invalide
       if (error.name === "CastError") {
           return res.status(400).json({
            message: "identifiant de naissance invalide"
           });
       }

       //Autre erreurs
       console;log(error);
       res.status(500).json({
        message: "Erreur interne du serveur"
       });
    }
};

//Supprimer les naissance
const supprimerNAissance = async (req, res) =>{
    try{
        // vérifier si l'ID est un objectid MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                message: "Identifiant de naissance invalide"
            });
        }
        const naissance = await naissanceService.supprimerNAissance(req.params.id);
        
        if(!naissance){
            return res.status(404).json({
                message:"Naissance introuvable"
            });
        }
        res.status(200).json({
            message:"Naissance supprimée avec succès",
            naissance
        });
    }catch(error){

        console.error(error);

        res.status(500).json({
            message:"Erreur interne au serveur"
        });
    }
};

const rechercherParNumeroActe = async (req, res) => {
    try {
        const naissance =
            await naissanceService.rechercherParNumeroActe(
                req.params.numeroActe
            );

        if (!naissance) {
            return res.status(404).json({
                message: "Aucune naissance trouvée avec ce numéro d'acte"
            });
        }

        res.status(200).json({
            naissance
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la recherche",
            error: error.message
        });
    }
};


module.exports = {creerNaissance, obtenirToutesLesNaissances,
    obtenirNaissanceParId,
    modifierNaissance,
    supprimerNAissance,
    rechercherParNumeroActe
};