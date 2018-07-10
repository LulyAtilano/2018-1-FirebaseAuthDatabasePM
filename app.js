window.onload = ()=>{
    firebase.auth().onAuthStateChanged((user)=>{
        if(user){ //Si está logeado, mostraremos la opción loggedIn
            loggedIn.style.display = "block";
            loggedOut.style.display = "none";
            username.innerText = user.displayName;
        }else{ //Si NO está logeado, mostraremos la opción loggedOut
            loggedIn.style.display = "none";
            loggedOut.style.display = "block";
        }
        console.log("User > "+JSON.stringify(user));
    });

    firebase.database().ref('gifs/'); // este ref es la ruta para llegar al gif
        .once('value')
        .then(gif) => {
            console.log("El Gif > " + JSON.stringify(gif));
        }
        .cath((error) => {
            console.log("Database error > " + JSON.stringify(error));
        };
)
    //Base de Datos para consultar SOLO UNA VEZ
    firebase.database().ref('gifs')
    .limitToLast(2) //Filtro de datos, donde limita sólo 2 gifs
    .once('value') // para escuchar datos solo una vez
    .then(gifs) => {
        console.log("Gifs >" + JSON.stringify(gifs));
    } 
    .catch(error) => {
        console.log("Database error > " + error);
    }

    //Base de datos para consultar MAS DE UNA VEZ
    firebase.database().ref('gif')
        .limitToLast(2) // Filtro de mensajes cuando se cargan los datos
        .on('child_added', (newGif) => { // para escuchar datos más veces o doblegados
            gifContainer.innerHTML += `
            <p> ${newGif.val().creatorName} </p>
            <img style="width: 200px" src="${newGif.val().gifURL}"></img> 
            `;
        });
};

//Registro
function registerWithFirebase(){
    const emailValue = email.value;
    const passwordValue = password.value;

    firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
        .then(()=>{
            console.log("Usuario creado con éxito");
        })
        .catch((error)=>{
            console.log("Error de firebase > Código > "+error.code); //error.code nos mostrará el código de error para informarnos qué pasó
            console.log("Error de firebase > Mensaje > "+error.message); //error.message nos mostrará el mensaje de firebase del mismo error
        });
}
//Login
function loginWithFirebase(){
    const emailValue = email.value;
    const passwordValue = password.value;

    firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
        .then(()=>{
            console.log("Usuario inició sesión con éxito");
        })
        .catch((error)=>{
            console.log("Error de firebase > Código > "+error.code); //error.code nos mostrará el código de error para informarnos qué pasó
            console.log("Error de firebase > Mensaje > "+error.message); //error.message nos mostrará el mensaje de firebase del mismo error
        });
}

function logoutWithFirebase(){
    firebase.auth().signOut()
        .then(()=>{
            console.log("Usuario finalizó su sesión");
        })
        .catch((error)=>{
            console.log("Error de firebase > Código > "+error.code); //error.code nos mostrará el código de error para informarnos qué pasó
            console.log("Error de firebase > Mensaje > "+error.message); //error.message nos mostrará el mensaje de firebase del mismo error
        });
}
//Login con Facebook
function facebookLoginWithFirebase(){
    const provider = new firebase.auth.FacebookAuthProvider(); // creamos un nuevo objeto 

    provider.setCustomParameters({ // le decimos que haga un login con facebook y enlace un popup
        'display' : 'popup'
    });

    firebase.auth().signInWithPopup(provider)
        .then(()=>{
            console.log("Login con facebook exitoso");
        })
        .catch((error)=>{
            console.log("Error de firebase > Código > "+error.code); //error.code nos mostrará el código de error para informarnos qué pasó
            console.log("Error de firebase > Mensaje > "+error.message); //error.message nos mostrará el mensaje de firebase del mismo error
        });
}

// Tareas Laboratoria
// Tarea: Nombre, duración, dificultad, estado
// Estudiantes
// Coach

function sendGif(){
    const gifValue = gifArea.value;

    const newfifKey = firebase.database().ref().child("gifs").push().key;
    const currentUser = firebase.auth().currentUser; // Si estamos logeados siempre podemos ver el nombre el usuario;
    firebase.database().ref(`gifs/${newGifKey}`).set({
        gifURL : gifValue,
        creatorName : currentUser.displayName,
        creator : currentUser.uid,
    });
}

//Opción para enviar foto
function sendPhotoToStorage(){
    const photoFile = photoFileSelector.files[0];
    const fileName = photoFile.name; // nombre del archivo, sirver para armar la ruta
    const metadata = { // datos sobre el archivo que estamos subiendo
        contentType : photoFile.type // tipo de archivo que estamos subiendo
    };
    //va a retornar una tarea o task (objeto)
    const task = firebase.storage().ref('images') //corresponden a las carpetas que tenemos dentro de storage
        .child(fileName)
        .put(photoFile, metadata);
        
    task.then(snapshot => snapshot.ref.getDownloadURL()) //obtenemos la URL de la imagen
        .then(url => {
            console.log("URL del archivo > " + url);
        });
}