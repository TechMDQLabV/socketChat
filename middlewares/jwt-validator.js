const jwt = require('jsonwebtoken');
const { User } = require('../models');

const jwtValidator = async(req, res, next) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(400).json({
            msg: 'No hay token en la petición'
        });
    }

    try{
        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );

        const authenticatedUser = await User.findById(uid);

        if(!authenticatedUser){
            return res.status(401).json({
                msg: 'No existe el usuario'
            });            
        }

        if(!authenticatedUser.state){
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        req.authenticatedUser = authenticatedUser;

        next();
    }catch(error){
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};



module.exports = {
    jwtValidator
};