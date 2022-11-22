'use strict';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { create } from 'express-handlebars';
import Contenedor from './resources/handlerFiles.js';
import Chat from './resources/handlerChat.js';
import { Server as socketServer } from 'socket.io';
import http from 'http';
const app = express();
const server = http.createServer(app);
const io = new socketServer(server);
const archivo = new Contenedor('productos.txt');
const chat = new Chat('chat.txt');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;
const hbs = create({
    extname: '.hbs',
    partialsDir: [__dirname + '/views/components']
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    //Confirma conexión de los usuarios
    console.log('Usuario conectado')
    //Emite al cliente
    archivo.getAll().then(datafile => io.emit('productos', datafile));
    //Recibe info del cliente
    socket.on('newProduct', (data) => {
        archivo.save(data)
            .then(() => {
                archivo.getAll()
                    .then(datafile => {
                        io.emit('productos', datafile)
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    });
    //------------------------------------------------------------------------
    chat.readChats().then(dataChats => io.emit('chatList', dataChats)).catch(error => console.log(error));
    socket.on('newChat', (data) => { 
        chat.saveChats(data)
            .then(() => {
                chat.readChats()
                    .then(dataChats => io.emit('chatList', dataChats))
                    .catch(error => console.log(error));
             })
            .catch(error => console.log(error));
    });
});

app.get('/deleteallchats', (req, res) => { 
    chat.deleteAllChats()
        .then(res.send('Historial de chats borrados!'))
        .catch(error => console.log(error))
});
server.listen(PORT);
console.log('Server en puerto: ' + PORT);