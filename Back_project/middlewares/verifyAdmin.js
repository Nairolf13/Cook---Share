const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const verifyAdmin = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Un token est requis pour l'authentification" });
    }

    try {
        const decodedToken = jwt.verify(token.split(' ')[1], "florian");
        const user = await userModel.findOne({ _id: decodedToken.userId })
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé : vous n'êtes pas administrateur" });
        }
        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré !" });
    }
};

module.exports = verifyAdmin