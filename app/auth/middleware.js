const jwt = require('jsonwebtoken');
const { getToken } = require('../utils/get-token');
const config = require('../config');
const User = require('../user/model');

function decodeToken(){
    return async function(req, res, next){
        try {
            let token = getToken(req);
            //jika tidak ada token 
            if(!token) return next();
            //jika ada token
            req.user = jwt.verify(token, config.secretKey);

            let user = await User.findOne({token: {$in: [token]}});
            if(!user){
                return res.json({
                    error: 1,
                    message: 'token expired'
                });
            }
        } catch (err) {
            if(err && err.name == 'JsonWebTokenError'){
                return res.json({
                    error: 1,
                    message: err.message
                });
            }

            next(err);
        }
        
        return next();
    }
}

module.exports = {
    decodeToken
}