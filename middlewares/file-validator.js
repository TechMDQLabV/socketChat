
const fileValidator = (req, res, next) => {
    
    if (!req.files || !req.files.file ||Object.keys(req.files).length === 0) {
        return res.status(400).json('No hay archivos para subir.');
    }
    
    next();
}

module.exports = {
    fileValidator
}