const verifyToken = require("../middlewares/verifyToken")
const recetteModel = require("../models/recetteModel")
const recetteRouter = require("express").Router()
const upload = require("../middlewares/downloadPicture")
const userModel = require("../models/userModel")
const verifyAdmin = require("../middlewares/verifyAdmin")

recetteRouter.post("/recette", verifyToken, upload.single('picture'), async (req, res) => {
    try {
        const user = await userModel.findById(req.userid)
        if(!user) {
            throw new Error("l'utilisateur essayant de créer la receette n'exite pas ")
        }
        const newRecette = new recetteModel({
            ...req.body,
            imageRecette: req.file ? req.file.filename : null 
        });

        await newRecette.save();
       
        await userModel.updateOne({_id: req.userid}, {$push: {recipes: newRecette._id} })
        res.json(newRecette);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de la recette." });
    }
})

recetteRouter.get('/recette',verifyToken, async (req, res) => {
    try {
        let filter = {
            isShared: true
        };
       
        if (req.query.title) {
            filter.title = new RegExp('^' + req.query.title, 'i') ;
            
        }
        
        const recettes = await recetteModel.find(filter)
        res.json(recettes)
    } catch (error) {
        res.json(error)
    }
})

recetteRouter.get('/me/recettes',verifyToken, async (req, res) => {
    try {
        let filter = {};
       
        if (req.query.title) {
            filter = { title: new RegExp('^' + req.query.title, 'i') };
        }
        const user = await userModel.findById(req.userid).populate('recipes')
        const recettes = user.recipes

        res.json(recettes)
    } catch (error) {
        res.json(error)
    }
})

recetteRouter.get('/recette/:id', verifyToken,async (req, res) => {
    try {
        const recette = await recetteModel.findOne({ _id: req.params.id })
        response.json(recette)
    } catch (error) {
        res.json(error)
    }
})

recetteRouter.put('/recette/:id',verifyToken,async (req, res) => {
    try {
        if (req.user){
            throw new Error ("L'utilisateur qui veut modifier la recette n'est pas autorisé !")
        }
        await recetteModel.updateOne({ _id: req.params.id }, req.body)
        res.json({ message: "La recette a été mise à jour" })
    } catch (error) {
        res.json(error)
    }
})

recetteRouter.patch('/shareRecipe/:id',verifyToken,async (req, res) => {
    try {
        if (req.user){
            throw new Error ("L'utilisateur qui veut modifier la recette n'est pas autorisé !")
        }
        await recetteModel.updateOne({ _id: req.params.id }, {isShared: true})
        res.json({ message: "La recette a été mise à jour" })
    } catch (error) {
        res.json(error)
    }
})

recetteRouter.delete('/recette/:recette_id', verifyToken ,async (req, res) => {
   
    try {
        await recetteModel.deleteOne({ _id: req.params.recette_id })
        await userModel.updateOne({_id: req.userid}, { $pull: {recettes: req.params.recette_id}})
        res.json({ message: "La recette a bien été supprimé" })
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = recetteRouter