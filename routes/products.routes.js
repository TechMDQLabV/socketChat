const { Router } = require('express');
const { getProducts, getProduct, updateProduct, addProduct, productsPatch, deleteProduct } = require('../controllers/products.controller');
const { check } = require('express-validator');
const { fieldsValidator, jwtValidator, isAdminRole } = require('../middlewares');
const { existIdProduct, existIdCategory } = require('../helpers/db-validators');

const router = Router();

router.get('/', getProducts);        

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    fieldsValidator,
    check('id').custom( existIdProduct )
], getProduct);

router.put('/:id', [
    jwtValidator,
    check('id', 'No es un ID válido').isMongoId(),   
    fieldsValidator,
    check('id').custom( existIdProduct )
], updateProduct); 
  
router.post('/', [
    jwtValidator,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'El ID de categoría no es un ID válido').isMongoId(),    
    check('category', 'El id de categoría es obligatorio').not().isEmpty(),
    fieldsValidator,
    check('id').custom( existIdCategory )    
], addProduct); 

router.patch('/', productsPatch); 
  
router.delete('/:id', [
    jwtValidator,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    fieldsValidator,
    check('id').custom( existIdProduct )    
], deleteProduct);           

module.exports = router;