const mongoose = require("mongoose")

const recetteSchema = new mongoose.Schema({

    title:{
        type: String,
        required:[true,"Le titre est requis"]
    },
    ingredient:[{type: String,}
       ],
    instructionPreparation:{
        type: String,
        required:[true,"Les instructions sont requise"]
    },
    tempsPreparation:{
        type: Number,
        required:[true,"Le temps de preparation est requis"]
    },
    tempsCuisson:{
        type: Number,
        required:[true,"Le temps de cuisson est requis"]
    },
    difficulte:{
        type: String,
        required:[true,"Le difficulté est requise"]
    },
    categorie:{
        type: String,
        required:[true,"Le categorie est requise"]
    },
    imageRecette:{
        type: String
    }, created_at: {
        type: Date,
        default: Date.now
    },
    isShared: {
        type: Boolean,
        default: false
    }
})

const recetteModel = mongoose.model("recettes",recetteSchema);
module.exports = recetteModel