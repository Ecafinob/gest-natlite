const Naissance = require("../models/Naissance");

//enregistrer la naissance
const creerNaissance = async (donnees) => {
    const naissance = new Naissance(donnees);

    return await naissance.save();
};
//obetenir toute les naissnces
const obtenirToutesLesNaissances = async (
    page = 1,
    limit = 10,
    recherche = ""
) =>{
    const skip = (page - 1) * limit;

    const filtre = {};
   
    if (recherche) {
        filtre.$or = [ 
        {nomEnfant: {$regex: recherche, $options: "i"} },
        {prenomEnfant:{$regex: recherche, $options:"i"} },
        {nomPere: {$regex: recherche, $options: "i"}},
        {nomMere: {$regex: recherche, $options: "i"}},
        {lieuNaissance: {$regex: recherche, $options: "i"}},
        {numeroActe: {$regex: recherche, $options: "i"}}

        ];
    }

    const naissances = await Naissance.find(filtre)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

    const total =await Naissance.countDocuments(filtre);
    return {
        naissances,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}
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