
const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es oblicatorio']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es oblicatorio']
    },
    userName: {
        type: String,
        required: [true, 'El nombre de usuario es oblicatorio']
    },  
    email: {
        type: String,
        required: [true, 'El email es oblicatorio'],
        unique: true
    },   
    password: {
        type: String,
        required: [true, 'La contraseña es oblicatoria'],
    },     
    img: {
        type: String,
    }, 
    role: {
        type: String,
        required: true,
        role: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    }, 
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }     
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

module.exports = model('User', UserSchema);