const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);



function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

let usernameStore = new Set()
let usersQueue = new Array();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("enqueue", username => {


    if (usernameStore.has(username)) {
      socket.emit("error", "Username is already taken");
      return;
    }

    if (socket.username) {
      usernameStore.delete(socket.username);
    }

    usernameStore.add(username);
    socket.username = username;
    usersQueue.push(socket)
    console.log(usernameStore)
    socket.emit("in_queue")

    if (usersQueue.length === 3) {
      let contestId = generateUUID()
      while (usersQueue.length !== 0) {
        let currentUser = usersQueue.shift()
        currentUser.join(contestId)
        currentUser.emit('ready')
      }
    }

    console.log(io.sockets.adapter.rooms)
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      usernameStore.delete(socket.username);
      socket.username = null;
    }
    console.log(`${socket.id} disconnected`);
  });

});

module.exports = { httpServer };
