const Naissance = require("../models/Naissance");

//enregistrer la naissance
const creerNaissance = async (donnees) => {
    const naissance = new Naissance(donnees);

    return await naissance.save();
};
//obetenir toute les naissnces
const obtenirToutesLesNaissances = async () =>{
    return await Naissance.find().sort({createAt: -1});
};
//obtenir la naissance par l'id
const obtenirNaissanceParId = async (id) =>{
    return await Naissance.findById(id);
};
//Modifier la naissance
const modifierNaissance = async (id, donnees) =>{
    return await Naissance.findByIdAndUpdate(
        id,
        donnees,
        {
            new:true,
            runValidators:true
        }
    );
};

//Supprimer la naissance
const supprimerNAissance = async (id) =>{
    return await Naissance.findByIdAndDelete(id)
};

//Rechercher la naissance par numéro d'acte
const rechercherParNUmeroActe = async (numeroActe) =>{
    return await Naissance.findOne({numeroActe});
};

module.exports = {
    creerNaissance,
    obtenirToutesLesNaissances,
    obtenirNaissanceParId,
    modifierNaissance,
    supprimerNAissance,
    rechercherParNUmeroActe
};