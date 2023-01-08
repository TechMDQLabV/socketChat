
let user = null;
let socket = null;

const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }
};


const main = async() => {
    await validateJWT();


};

main();

//const socket = io();