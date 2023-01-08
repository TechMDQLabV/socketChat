

const auth = require('./auth.controller');
const categories = require('./categories.controller');
const products = require('./products.controller');
const search = require('./search.controller');
const uploads = require('./uploads.controller');
const users = require('./users.controller');


module.exports = {
    ...auth,
    ...categories,
    ...products,
    ...search,
    ...uploads,
    ...users
};