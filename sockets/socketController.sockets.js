const { checkJWT } = require("../helpers/generate-jwt");
const { ChatMsg } = require('../models');


const chatMsg = new ChatMsg();

const socketController = async ( socket, io ) =>{
    const user = await checkJWT(socket.handshake.headers['x-token']);
    if(!user){
        return socket.disconnect();
    }
    chatMsg.connectUser( user );
    io.emit('active-users', chatMsg.usersList);
    socket.emit('get-msg', chatMsg.lastTen);

    socket.join( user.id );

    socket.on('disconnect', () => {
        chatMsg.disconnectUser( user.id );
        io.emit('active-users', chatMsg.usersList);        
    });

    socket.on('send-msg', ({ msg, uid }) => {
        if( uid ){
            socket.to( uid ).emit( 'private-msg', { de: user.name, msg });
        }else{
            chatMsg.sendMsg(user.id, user.name, user.lastName, msg);
            io.emit('get-msg', chatMsg.lastTen);
        }
    });
};

module.exports = {
    socketController
};