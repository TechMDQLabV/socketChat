const { User, Category, Product, Role } = require('../models');

const { ObjectId } = require('mongoose').Types;
const availableCollections = [ 'category', 'product', 'role', 'user' ];

const searchCategories = async( toSearch = '', res ) => {
    const isMongoId = ObjectId.isValid( toSearch );
    if(isMongoId){
        const category = await Category.findById(toSearch)
            .populate('user');
        return res.json({
            results: (category) ? [ category ] : []
        });
    }else{
        const query = { state: true };
        const regex = new RegExp( toSearch, 'i' );
        const [ total, categories ] = await Promise.all([
            Category.count(query),
            Category.find({ name: regex, query })
                .populate('user')
            ]);
        return res.json({
            results: total, categories
        });        
    }
};

const searchProducts = async( toSearch = '', res ) => {
    const isMongoId = ObjectId.isValid( toSearch );
    if(isMongoId){
        const product = await Product.findById(toSearch)
            .populate('user')
            .populate('category');
        return res.json({
            results: (product) ? [ product ] : []
        });
    }else{
        const query = { state: true };
        const regex = new RegExp( toSearch, 'i' );
        const [ total, products ] = await Promise.all([
            Product.count(query),
            Product.find({ regex, query })
                .populate('user')
                .populate('category')
            ]);
        return res.json({
            results: total, products
        });        
    }
};

const searchUsers = async( toSearch = '', res ) => {
    const isMongoId = ObjectId.isValid( toSearch );
    if(isMongoId){
        const user = await User.findById(toSearch);
        return res.json({
            results: (user) ? [ user ] : []
        });
    }else{
        const query = { state: true };
        const regex = new RegExp( toSearch, 'i' );
        const [ total, users ] = await Promise.all([
            User.count(query),
            User.find({
                $or: [{ name: regex }, { lastName: regex }, { email: regex }],
                $and: [ query ]
            })
        ]);
        return res.json({
            results: total, users
        });        
    }
};

const search = ( req, res) => {
    const { collection, toSearch } = req.params;

    if( !availableCollections.includes(collection)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${availableCollections}`
        })
    }

    switch(collection){
        case 'category':
            searchCategories(toSearch, res);            
            break;
        case 'product':
            searchProducts(toSearch, res);            
            break;            
        case 'role':
            break;            
        case 'user':
            searchUsers(toSearch, res);
            break;    
        default: 
            res.status(500).json({
                msg: 'No existe la búsqueda'
            })
    }

};


module.exports = {
    search
}