import cryptoUtils from "../utils/cryptoUtils.js";

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.status(401).json({message: "Non autorizzato"})
    }
    const token = authorization.split(' ')[1];
    try {
        const decoded = cryptoUtils.verifyJWT(token);
        if (!decoded) {
            return res.status(401).json({message: `Errore di autenticazione: ${error.message}`})
        }
        req.userId = decoded.sub;
        next();
    } catch (error) {
        res.status(401).json({message: "Errore di autenticazione: error.message"})
    }
};

export default authMiddleware;