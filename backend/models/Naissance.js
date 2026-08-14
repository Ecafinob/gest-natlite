const mongoose = require("mongoose");

const naissanceSchema = new mongoose.Schema(
    {
        nomEnfant:{
            type:String,
            require:true,
            trim:true
        },
        prenomEnfant:{
            type:String,
            require:true,
            trim:true
        },
        sexe:{
            type:String,
            require:true,
            trim:true
        },
        dateNaissance:{
            type:Date,
            require:true
        },
        lieuNaissance:{
            type:String,
            require:true,
            trim:true
        },
        nomPere:{
            type:String,
            require:true,
            trim:true
        },
        nomMere:{
            type:String,
            require:true,
            trim:true
        },
        numeroActe:{
            type:String,
            require:true,
            unique:true,
            trim:true
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Naissance", naissanceSchema);