const url = 'http://localhost:8080/api/auth/';
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const usersList = document.querySelector('#usersList');
const msgList = document.querySelector('#msgList');
const btnOut = document.querySelector('#btnOut');


let user = null;
let socket = null;

const validateJWT = async() => {
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token}
    });

    const { authenticatedUser, token: tokenUser } = await resp.json();
    localStorage.setItem('token', tokenUser);
    user = authenticatedUser;

   // document.title = user.name + " " + user.lastName;

    await connectSocket();
};

const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });    

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('get-msg', drawMsgs);

    socket.on('active-users', drawUsers);

    socket.on('private-msg', (payload) => {
        console.log('Privado ' , payload);
    });
};

const drawUsers = ( users = [] ) => {
    let usersHtml = '';
    users.forEach( user => {
        usersHtml += `
            <li>
                <p>
                    <h6 class="text-success"> ${ user.name } ${ user.lastName } </h6>
                    <span class="fs-8 text-muted">${ user.uid }</span>
                </p>
            </li>
        `;
    });
    usersList.innerHTML = usersHtml;
};

const drawMsgs = ( msgs = [] ) => {
    let msgsHtml = '';
    msgs.forEach( msg => {
        msgsHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${ msg.name } ${ msg.lastName } </span>
                    <span class="fs-8">${ msg.msg }</span>
                </p>
            </li>
        `;
    });
    msgList.innerHTML = msgsHtml;
};

txtMsg.addEventListener('keyup', ({ keyCode }) => {
    const msg = txtMsg.value;
    const uid = txtUid.value;
    if(keyCode !== 13 ){
        return;
    }
    if(msg.length === 0){
        return; 
    }
    socket.emit('send-msg', { msg, uid });
    txtMsg.value = '';
});

const main = async() => {
    await validateJWT();


};

main();
