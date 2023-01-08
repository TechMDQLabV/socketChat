
const auth = require('./auth.routes');
const categories = require('./categories.routes');
const products = require('./products.routes');
const search = require('./search.routes');
const uploads = require('./uploads.routes');
const users = require('./users.routes');


module.exports = {
    auth,
    categories,
    products,
    search,
    uploads,
    users
};