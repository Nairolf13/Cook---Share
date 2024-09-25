const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
 
    if (!token) {
        return res.status(403).json({ message: "Un token est requis pour l'authentification" });
    }

    try {
        const tokenWithoutBearer = token.split(' ')[1];
        const decodedToken = jwt.verify(tokenWithoutBearer, "florian");

        req.userid = decodedToken.userId;
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré !" });
    }

    return next();
};

module.exports = verifyToken;
