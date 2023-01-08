const { response } = require("express");


const isAdminRole = (req, res, next) => {
    if( !req.authenticatedUser ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const { role, name } = req.authenticatedUser;
    if( role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} no tiene el rol de Administrador`
        });        
    }
    next();
};

const hasRole = ( ...roles ) => {
    return (req, res, next) =>{
        if( !req.authenticatedUser ){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }
        if( !roles.includes( req.authenticatedUser.role )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });            
        }


        next();
    };
};

module.exports = {
    isAdminRole,
    hasRole
};