const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, folder = '', availableExtensions = ['png','jpg','jpeg','gif'] ) => {

    return new Promise( (resolve, reject) => {
        const { file } = files;
        const trackName = file.name.split('.');
        const extension = trackName[trackName.length -1];

        if( !availableExtensions.includes(extension) ){
            return reject(`La extensión ${extension} no está permitida`);
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);
    
        file.mv(uploadPath, (err) => {
        if (err) {
            return reject(err);
        }
    
        resolve(tempName);
        });    
    });
}

module.exports = {
    uploadFile
}