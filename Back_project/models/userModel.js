const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username est requis !"]
    },
    email: {
        type: String,
        required: [true, "L'email est requis"]
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"]
    },
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recettes"
        }
    ], role: {
        type: String,
        default: "user"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const userModel = mongoose.model("user", userSchema);
module.exports = userModel