const userModel = require("../models/userModel")
const userRouter = require("express").Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");
const secretKey = "florian"

userRouter.post("/user", async(req,res)=>{
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).json(newUser);
    } catch (error) {
        res.json(error)
    }
})

userRouter.post('/user/login', async (req,res)=>{
    const {username, password } = req.body;
try {
    const user = await userModel.findOne({username})

    if (!user) {
        return res.status(400).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '24h' });

    return res.status(200).json({ success: true, token });
} catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
}
});

userRouter.get('/me/users/',verifyAdmin, async (req, res) => {
    try {
        const users = await userModel.find()
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
})

userRouter.get('/me',verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.userid)
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
})

userRouter.put('/user/:id',verifyToken, async (req, res) => {
    try {
        await userModel.updateOne({ _id: req.params.id }, req.body)
        res.json({ message: "L'utilisateur a été mise à jour" })
    } catch (error) {
        res.json(error)
    }
})

userRouter.delete('/user/:id',verifyToken, async (req, res) => {
    try {
        await userModel.deleteOne({ _id: req.params.id })
        res.json({ message: "L'utilisateur a bien été supprimé" })
    } catch (error) {
        res.json(error)
    }
})

module.exports = userRouter