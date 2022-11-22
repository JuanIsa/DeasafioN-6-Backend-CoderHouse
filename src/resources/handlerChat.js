'use strict';
import fs from 'fs';

class Chat {
    constructor(nameFile) {
        this.nameFile = nameFile;
        this.chatList = [];
    }
    async saveChats(newchat) {
        const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
        this.fileInfo = JSON.parse(fileRead);
        try {
            this.chatList.push(newchat);
            await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.chatList), 'utf-8');
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async readChats() {
        try {
            const fileRead = await fs.promises.readFile(`./src/resources/${this.nameFile}`, 'utf-8');
            this.fileInfo = JSON.parse(fileRead);
            return this.fileInfo;
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
    async deleteAllChats() {
        this.chatList=[]
        try {
            await fs.promises.writeFile(`./src/resources/${this.nameFile}`, JSON.stringify(this.chatList), 'utf-8');
            console.log('Historial de chat borrado')
        } catch (error) {
            return `Hubo un error: ${error}`;
        }
    }
}
export default Chat;