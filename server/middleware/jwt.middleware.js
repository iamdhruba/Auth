import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "24h"})
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch(error) {
        return res.status(401).json({message: "Unauthorized"});
    }
}
