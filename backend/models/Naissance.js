const mongoose = require("mongoose");

const naissanceSchema = new mongoose.Schema(
    {
        nomEnfant:{
            type:String,
            required:[true,"Le nom de l'enfant est obligatoire"],
            trim:true
        },
        prenomEnfant:{
            type:String,
            required:[true, "Le prénom de l'enfant est obligatoire"],
            trim:true
        },
        sexe:{
            type:String,
            required:[true, "Le saxe de l'enfant est obligatoire"],
            trim:true
        },
        dateNaissance:{
            type:Date,
            required:[true, "La date de naissance est obligatoire"]
        },
        lieuNaissance:{
            type:String,
            required:[true, "Le lieu de naissance est obligatoire"],
            trim:true
        },
        nomPere:{
            type:String,
            required:[true, "Le nom du père est obligatoire"],
            trim:true
        },
        nomMere:{
            type:String,
            required:[true, "Le nom de la mère est obligatoire"],
            trim:true
        },
        numeroActe:{
            type:String,
            required:[true, "Le numéro d'acte est obligatoire"],
            unique:true,
            trim:true
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Naissance", naissanceSchema);