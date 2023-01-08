
const myForm = document.querySelector('form');
const url = 'http://localhost:8080/api/auth/';

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
    }); 
});

function handleCredentialResponse(response) {

    //const responsePayload = decodeJwtResponse(response.credential);
     // Google token : ID_TOKEN

     const body = { id_token: response.credential };
     //console.log(body);
     fetch(url + 'google', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body)
     })
         .then(resp => resp.json())
         .then( ({ token }) => {
             console.log(token);
             localStorage.setItem('token', token);
         })
         .catch(console.warn);
 }

 const button = document.getElementById('google_signout');
 button.onclick = () => {
     console.log(google.accounts.id);
     google.accounts.id.disableAutoSelect();

     google.accounts.id.revoke( localStorage.getItem( 'token' ), done =>{
         localStorage.clear();
         location.reload();
     });

 function signOut(){
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke( localStorage.getItem( 'token' ), done =>{
        localStorage.clear();
        location.reload();
    });        
 }
 };