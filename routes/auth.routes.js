const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth.controller');
const { fieldsValidator, jwtValidator } = require('../middlewares');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    fieldsValidator
], login);    

router.post('/google', [
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    fieldsValidator
], googleSignIn); 

router.get('/', jwtValidator, renewToken );

module.exports = router;