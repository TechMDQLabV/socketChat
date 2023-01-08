const { Router } = require('express');
const { usersGet, usersPut, usersPost, usersPatch, usersDelete } = require('../controllers/users.controller');
const { check } = require('express-validator');
const { fieldsValidator, jwtValidator, isAdminRole, hasRole } = require('../middlewares');
const { isValidRole, existEmail, existIdUser } = require('../helpers/db-validators');



const router = Router();

router.get('/', usersGet);        

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existIdUser ),
    check('role').custom( isValidRole ),
    fieldsValidator
], usersPut); 
  
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('userName', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom( existEmail ),
    check('password', 'El password debe ser de más de 6 caracteres').isLength({ min:6 }),
    check('role').custom( isValidRole ),
    //check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    fieldsValidator
], usersPost); 

router.patch('/', usersPatch); 
  
router.delete('/:id', [
    jwtValidator,
    isAdminRole,
    hasRole('ADMIN_ROLE','SALES_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existIdUser ),
    fieldsValidator
], usersDelete);           

module.exports = router;