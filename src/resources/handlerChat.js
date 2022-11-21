'use strict';
import fs from 'fs';

class Chat {
    constructor(nameFile) {
        this.nameFile = nameFile;
        this.chatList = [];
    }
    async save(objeto) {
        let idSet = 0;
        let producto = {
            title: objeto.title,
            price: parseFloat(objeto.price),
            thumbnail: objeto.thumbnail
        };
        try {
            if (this.fileInfo.length > 0) {
                producto.id = this.fileInfo[this.fileInfo.length - 1].id + 1;
                this.fileInfo.push(producto);
                idSet = this.fileInfo[this.fileInfo.length - 1].id;
            } else {
                this.fileInfo.push({ ...objeto, id: 1 });
                idSet = 1;
            }
            await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.fileInfo), 'utf-8');
            return producto;
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
}