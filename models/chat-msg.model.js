

class Msg {
    constructor( uid, name, lastName, msg ) {
        this.uid = uid;
        this.name = name;
        this.lastName = lastName;
        this.msg = msg;
    }
}

class ChatMsg {
    constructor(){
        this.msgs = [];
        this.users = {};
    }

    get lastTen() {
        this.msgs = this.msgs.splice(0,10);
        return this.msgs;
    }

    get usersList() {
        return Object.values( this.users );
    }

    sendMsg( uid, name, lastName, msg ) {
        this.msgs.unshift(
            new Msg(uid, name, lastName, msg)
        );
    }

    connectUser( user ){
        this.users[user.id] = user;
    }

    disconnectUser( id ){
        delete this.users[id];
    }
}

module.exports = ChatMsg;