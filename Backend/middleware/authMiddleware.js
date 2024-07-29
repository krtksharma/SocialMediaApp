const jwt = require('jsonwebtoken');
const {success, failure:error} = require('../utils/responseStatus');
const User = require('../models/userModel');

const authChecker = async (req, res, next) => {
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        return res.json(error(401,"Not Authorized without token"));
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    try{
        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET);
        // console.log("decoded value ",decoded);
        req.id = decoded.id;
        const user = await User.findById(req.id);
        if(!user)
            return res.json(error(403,"User not found"));
        next();   
    }catch(err){
        console.error("error is "+err.message);
        return res.json(error(401,"Invalid token"));
    }
};

module.exports = {
    authChecker,
};
