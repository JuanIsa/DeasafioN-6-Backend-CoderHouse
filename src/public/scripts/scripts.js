const socket = io();
//Recibir información del server.
socket.on('productos', productos => {
    tabla(productos).then(tabla => {
        document.getElementById('tabla').innerHTML = tabla;
    })
});
//Utilizo el fetch que piden en las rúbricas de entrega.
function tabla(productos) {
    let renderConditional=true
    if (productos.length > 0) renderConditional = false;
    return fetch('../templates/table.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos, renderConditional })
            return html
        })
}

document.getElementById('inputProducts').addEventListener('submit', (e) => {
    e.preventDefault();
    //Envía información al server
    socket.emit('newProduct', {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    })
    //Borra el formulario
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('thumbnail').value = '';
});

/*************************************************************************************************************/

//     En la parte inferior del formulario de ingreso se presentará el centro de mensajes almacenados en el servidor, donde figuren los mensajes de todos los usuarios identificados por su email. 
// El formato a representar será: email(texto negrita en azul)[fecha y hora(DD / MM / YYYY HH: MM: SS)](texto normal en marrón) : mensaje(texto italic en verde) 
// Además incorporar dos elementos de entrada: uno para que el usuario ingrese su email(obligatorio para poder utilizar el chat) y otro para ingresar mensajes y enviarlos mediante un botón. 
// Los mensajes deben persistir en el servidor en un archivo(ver segundo entregable).

socket.on('chatList', chats => {
    chat(chats).then(chatList => {
        document.getElementById('chatContainer').innerHTML = chatList;
    })
});
//Utilizo el fetch que piden en las rúbricas de entrega.
function chat(chats) {
    return fetch('../templates/chatlist.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ chats })
            return html
        })
}


document.getElementById('inputChat').addEventListener('submit', (e) => {
    e.preventDefault();
    let chat = {
        userMail: document.getElementById('emailChat').value,
        date: `[${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]`,
        textChat: document.getElementById('textChat').value
    };
    document.getElementById('textChat').value = '';
    socket.emit('newChat', chat);
});