const {app}=require("./app");
const chalk=require("chalk");
const http = require('http');
const socketio = require('socket.io');

// server chat
const server = http.createServer(app);
const io = require('socket.io')(server);

require('./sockets')(io);

server.listen(process.env.PORT || 3000,function(){
    console.log(chalk.red.inverse("*** servidor iniciado en puerto 3000 ***"));
});