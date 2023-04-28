$(function () {
    const socket = io();

    // obteniendo DOM elementos de la interfaz
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // obteniendo DOM nombre de la interfaz
    const $nickForm = $('#nickForm');
    const $nickname = $('#nickname');
    const $nickError = $('#nickError');

    const $users = $('#usernames');
    var $nombre;
    var fotoPerfil = $('#fotoPerfil');

    $('#nickWrap').show();
        $nickForm.submit(e => {
            e.preventDefault()
            socket.emit('nuevo usuario', $nickname.val(), data => {
                if(data && $nickname.val()!==''){
                    $('#nickWrap').hide();
                    $('#contentWrap').show();
                    $nombre = $nickname.val();
                }else{
                    if($nickname.val()==''){
                        $nickError.html(`<div class="alert alert-danger">No puede ir vacio</div>`)
                    }else{
                        $nickError.html(`<div class="alert alert-danger">Este usuario ya existe</div>`)
                    }
                }
                $nickname.val('');
            });
        });
    

    // events
    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('mensaje enviado', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('');
    });

    socket.on('nuevo mensaje', function (data){
        $chat.append('<div class="chat-message"><div class="chat-message-avatar"><img src="./perfil/'+ fotoPerfil.val() +'" alt="Avatar"></div><div class="chat-message-content"><h4>'+ data.nick +'</h4><p>' + data.msg + '</p></div></div>  ')
    });

    socket.on('usernames', data => {
        let html = '';
        for(let i=0; i < data.length; i++){
            html += `<p class="user-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>${data[i]} ${data[i]==$nombre?'<span class="tu">tú</span>':''}<span class="dot-connector"></span></p>`;
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<div class="chat-message"><div class="chat-message-avatar"><img src="https://static.vecteezy.com/system/resources/thumbnails/009/784/767/small/avatar-with-gear-inside-dollar-solid-design-icon-of-financial-manager-vector.jpg" alt="Avatar"></div><div class="chat-message-content"><h4>${data.nick} <span style="font-size: 15px; color gray">Mensaje privado para tí</span></h4><p> ${data.msg}</p></div></div>`);
    })
})