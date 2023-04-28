module.exports = function (io){
    let users = {};

    io.on('connection', socket => {

    socket.on('nuevo usuario', (data, cb) => {
        if(data in users){
            cb(false);
        }else{
            cb(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }

        socket.on('mensaje enviado', (data, cb) => {
            var msg = data.trim();
            if(data!==''){
                if(msg.substr(0, 3) === '/p '){
                    msg = msg.substr(3);
                    const index = msg.indexOf(' ')
                    if(index !== -1){
                        var name = msg.substring(0, index);
                        var msg = msg.substring(index + 1);
                        if(name in users){
                            users[name].emit('whisper', {
                                msg,
                                nick: socket.nickname
                            });
                        }else{
                            cb('Error! Por favor ingresa un usuario valido');
                        }
                        
                    }else{
                        cb('Error! Por favor ingresa un mensaje');
                    }
                }else{
                    io.sockets.emit('nuevo mensaje', {
                        msg: data,
                        nick: socket.nickname
                    });
                }
            }
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
  });
}

