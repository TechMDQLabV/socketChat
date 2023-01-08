const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);

const { uploadFile } = require('../helpers/upload-file');
const { User, Product } = require('../models');

const uploadFiles = async (req, res) =>{

    try{
        const fileName = await uploadFile( req.files );
        res.json({
            fileName
        });
    } catch (msg){
        res.status(400).json({
            msg
        });
    }
};

const updateImg = async (req, res) => {

    const { collection, id } = req.params;

    let model;

    switch( collection ){
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;            
        default:
            return res.status(500).json({msg: 'Sin desarrollar'});
    }

    if( model.img ){
        const imgPath = path.join( __dirname, '../uploads', collection, model.img );
        if( fs.existsSync( imgPath ) ){
            fs.unlinkSync( imgPath );
        }
    }

    model.img = await uploadFile( req.files, collection );
    await model.save();
    res.json({ model });
};

const updateImgCloudinary = async (req, res) => {

    const { collection, id } = req.params;

    let model;

    switch( collection ){
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;            
        default:
            return res.status(500).json({msg: 'Sin desarrollar'});
    }

    if( model.img ){
        const path = model.img.split('/');
        const fileName = path[ path.length - 1];
        const [ public_id ] = fileName.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;
    await model.save();
    res.json( model );
};

const showImage = async (req, res) => {
    const { collection, id } = req.params;

    let model;

    switch( collection ){
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;            
        default:
            return res.status(500).json({msg: 'Sin desarrollar'});
    }

    if( model.img ){
        const imgPath = path.join( __dirname, '../uploads', collection, model.img );
        if( fs.existsSync( imgPath ) ){
            return res.sendFile( imgPath );
        }
    }else{
        const noImage = 'no-image.jpg';
        const noImagePath = path.join( __dirname, '../assets', noImage );        
        return res.sendFile( noImagePath );
    }
};

module.exports = {
    uploadFiles,
    updateImg,
    showImage,
    updateImgCloudinary
};