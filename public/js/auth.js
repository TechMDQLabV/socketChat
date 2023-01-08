
const myForm = document.querySelector('form');
const url = 'http://localhost:8080/api/auth/';

function onSignIn(googleUser) {

    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( data )
    })
    .then( resp => resp.json() )
    .then( ({ token }) => {
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch( console.log );
    
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}



myForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for( let el of myForm.elements ){
        if( el.value.length > 0 ){
            formData[el.name] = el.value;
        }
    }

    fetch( url+'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( formData ),
    })
    .then( resp => resp.json())
    .then( ({ msg, token }) => {
        if( msg ){
            return console.error(msg);
        }
        console.log(token);
        localStorage.setItem('token', token); 
        window.location = 'chat.html';                       
    }); 
});

function handleCredentialResponse(response) {

    //const responsePayload = decodeJwtResponse(response.credential);
     // Google token : ID_TOKEN

     const body = { id_token: response.credential };
     console.log(body);
     fetch(url + 'google', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body)
     })
         .then(resp => resp.json())
         .then( ({ token }) => {
             console.log(token);
             localStorage.setItem('token', token);
             window.location = 'chat.html';             
         })
         .catch(console.warn);
 }

 function signOut(){
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke( localStorage.getItem( 'token' ), done =>{
        localStorage.clear();
        location.reload();
    });        

}