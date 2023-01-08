const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFiles, updateImg, showImage, updateImgCloudinary } = require('../controllers/uploads.controller');
const { collectionValidator } = require('../helpers/db-validators');
const { fieldsValidator, fileValidator } = require('../middlewares');

const router = Router();

router.post( '/', fileValidator,uploadFiles );

router.put('/:collection/:id', [
    fileValidator,
    check('id', 'El id debe ser un id de MongoDB').isMongoId(),
    check('collection').custom(c => collectionValidator( c, ['users', 'products'] )),
    fieldsValidator
], updateImgCloudinary);
//], updateImg);

router.get('/:collection/:id', [
    check('id', 'El id debe ser un id de MongoDB').isMongoId(),
    check('collection').custom(c => collectionValidator( c, ['users', 'products'] )),
    fieldsValidator
], showImage);

module.exports = router;