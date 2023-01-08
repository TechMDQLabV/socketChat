const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { Product } = require('../models');

const getProducts = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };
    
    const [ totalproducts, products ] = await Promise.all([
        Product.count(query),
        Product.find(query)
            .populate('user')
            .populate('category')
            .skip(from)
            .limit(limit)
    ]);

    res.json({
        products,
        totalproducts,
        from,
        limit
    });
};

const getProduct = async(req, res = response) => {
    const { id } = req.params;

    const product = await Product.findById( id )
        .populate('user')
        .populate('category');

        if(!product){
        return res.status(400).json({
            msg: `El producto con el id ${id} no existe`
        });
    }

    res.json({
        product
    });
};

const updateProduct = async(req, res) => {
    const { id } = req.params;
    const { state, authenticatedUser, ...data } = req.body;
    console.log(req);

    if( name ){
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.authenticatedUser._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json({
        product
    });
};

const addProduct = async(req, res) => {
    const { state, user, ...body } = req.body;
    const name = body.name.toUpperCase();
    const productDB = await Product.findOne({ name });

    if(productDB){
        return res.status(400).json({
            msg: `El producto ${name} ya existe`
        });
    }
    
    const data = {
        name,
        user: req.authenticatedUser._id,
        price: body.price,
        description: body.description,
        category: body.category
    };

    const product = await new Product(data);
    await product.save();

    res.status(201).json({
        product
    });
};

const productsPatch = (req, res) => {
    res.json({
        msg: 'patch API - controller'
    });
};

const deleteProduct = async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json({
        product
    });
};

module.exports = {
    getProducts,
    getProduct,
    updateProduct,
    addProduct,
    productsPatch,
    deleteProduct
};