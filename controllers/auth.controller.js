const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const { User } = require('../models');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try{
        // verificar si el email existe
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                msg: 'User o password incorectos'
            });
        }

        // si el usuario está activo
        if(!user.state){
            return res.status(400).json({
                msg: 'El usuario no está activo'
            });
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'El password no es correcto'
            });            
        }

        // generar el jwt
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
};

const googleSignIn = async(req, res) =>{
    const { id_token } = req.body;

    try{
        const { name, lastName, userName, img, email } = await googleVerify( id_token );
        let user = await User.findOne({ email });

        if( !user ){
            const data = {
                name,
                lastName,
                userName,
                email,
                password: '123456',
                img,
                google: true,
            };
            user = new User(data);
            await user.save();
        }

        if(!user.state){
            return res.status(401).json({
                ok: false,
                msg: 'Hable con el administrador, usuario bloqueado'
            });            
        }

        // generar el jwt
        const token = await generateJWT( user.uid );        

        res.json({
            msg: 'Todo bien',
            user,
            token
        });        
    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
};

const renewToken = async ( req, res) => {
    const { authenticatedUser } = req;

    // generar el jwt
    const token = await generateJWT( authenticatedUser.id );

    res.json({
        authenticatedUser,
        token
    });
};

module.exports = {
     login,
     googleSignIn,
     renewToken
};