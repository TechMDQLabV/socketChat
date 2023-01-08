const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { Category } = require('../models');

const getCategories = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };
    
    const [ totalcategories, categories ] = await Promise.all([
        Category.count(query),
        Category.find(query)
            .populate('user')
            .skip(from)
            .limit(limit)
    ]);

    res.json({
        categories,
        totalcategories,
        from,
        limit
    });
};

const getCategory = async(req, res = response) => {
    const { id } = req.params;

    const category = await Category.findById( id )
        .populate('user');

        if(!category){
        return res.status(400).json({
            msg: `La categoría con el id ${id} no existe`
        });
    }

    res.json({
        category
    });
};

const updateCategory = async(req, res) => {
    const { id } = req.params;
    const { state, authenticatedUser, ...data } = req.body;
    console.log(req);
    data.name = data.name.toUpperCase();
    data.user = req.authenticatedUser._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json({
        category
    });
};

const addCategory = async(req, res) => {

    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });

    if(categoryDB){
        return res.status(400).json({
            msg: `La categoría ${name} ya existe`
        });
    }
    
    const data = {
        name,
        user: req.authenticatedUser._id,
    };

    const category = await new Category(data);
    await category.save();

    res.status(201).json({
        category
    });
};

const categoriesPatch = (req, res) => {
    res.json({
        msg: 'patch API - controller'
    });
};

const deleteCategory = async(req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json({
        category
    });
};

module.exports = {
    getCategories,
    getCategory,
    updateCategory,
    addCategory,
    categoriesPatch,
    deleteCategory
};