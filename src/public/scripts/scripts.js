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