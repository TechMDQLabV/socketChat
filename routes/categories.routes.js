const { Router } = require('express');
const { getCategories, getCategory, updateCategory, addCategory, categoriesPatch, deleteCategory } = require('../controllers/categories.controller');
const { check } = require('express-validator');
const { fieldsValidator, jwtValidator, isAdminRole } = require('../middlewares');
const { existIdCategory } = require('../helpers/db-validators');

const router = Router();

router.get('/', getCategories);        

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    fieldsValidator,
    check('id').custom( existIdCategory )
], getCategory);

router.put('/:id', [
    jwtValidator,
    check('id', 'No es un ID válido').isMongoId(),
    fieldsValidator,
    check('id').custom( existIdCategory )
], updateCategory); 
  
router.post('/', [
    jwtValidator,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldsValidator
], addCategory); 

router.patch('/', categoriesPatch); 
  
router.delete('/:id', [
    jwtValidator,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    fieldsValidator,
    check('id').custom( existIdCategory )    
], deleteCategory);           

module.exports = router;