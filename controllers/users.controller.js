const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

const usersGet = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };
    
    const [ totalUsers, users ] = await Promise.all([
        User.count(query),
        User.find(query)
            .skip(from)
            .limit(limit)
    ]);

    res.json({
        users,
        totalUsers,
        from,
        limit
    });
};

const usersPut = async(req, res) => {
    const { id } = req.params;
    const { _id, password, google, email, ...userData } = req.body;
 
    /// TODO validar contra db
    if( password ){
        const salt = bcryptjs.genSaltSync();
        userData.password = bcryptjs.hashSync( password, salt);
    }
    const user = await User.findByIdAndUpdate(id, userData);

    res.json({
        user
    });
};

const usersPost = async(req, res) => {

    const { name, lastName, userName, email, password, role } = req.body;
    const user = new User({ name, lastName, userName, email, password, role });
    
    // encriptar password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt);

    await user.save();

    res.json({
        user
    });
};

const usersPatch = (req, res) => {
    res.json({
        msg: 'patch API - controller'
    });
};

const usersDelete = async(req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { state: false });
    //para eliminacion fisica
    // const user = await User.findByIdAndDelete( id );

    res.json({
        user
    });
};

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersPatch,
    usersDelete
};