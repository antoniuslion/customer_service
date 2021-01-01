
const jwt = require("jsonwebtoken");

module.exports = async (req,res,next) => {
    try{
        if (!req.headers.authorization) {
            return res.status(401).send({ error: 'TokenMissing' });
        }
        else{
            const token = req.headers.authorization.split(" ")[1];
            //console.log(token);
            const decoded = jwt.verify(token, 'accesstokensecret');
            req.userData = decoded;
            //console.log(req.userData);
            next();
        }
    }catch (error) {
        return res.status(401).json({
            message: "Auth Failed"
        });
    }
};