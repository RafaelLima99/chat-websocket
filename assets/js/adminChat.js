

let conexaoWebSocket = null
let resourceId = null
let resourceIdCliente = null
let chatIdSelecionado = null
let primeiraMensagemCliente = false


chatsAbertos()
teste()


function teste(){

    conexaoWebSocket = new WebSocket('wss://fb082cdb03290f.lhr.life:8080');

    conexaoWebSocket.addEventListener('open', (event) => {
    
        console.log('conexão estabelecida pelo codigo do alex')

        // conexaoWebSocket.addEventListener('message', (event) => {
        //     console.log(event.data)
        //     console.log("mensagem recebida")
        //     resourceId = event.data
        // })
        
        conexaoWebSocket.onmessage = function(e) {
            
            console.log(e.data)

            let mensagemWebSocket = JSON.parse(e.data)

            if(mensagemWebSocket.tipoMensagem == 'resourceId'){
                resourceId = mensagemWebSocket.resourceId

                data = {resourceIdAdminLogado: resourceId}
                conexaoWebSocket.send(JSON.stringify(data))
            }

            if(mensagemWebSocket.tipoMensagem == 'novo chat'){
                insereCirculo(mensagemWebSocket.chatId)
            }
            
            if(mensagemWebSocket.tipoMensagem == 'nova mensagem'){
                console.log(resourceId)
                chatIdMensagem               = mensagemWebSocket.chatId
                resourceIdCliente            = mensagemWebSocket.resourceId
                const dataAtual              = new Date();
                const dataHoraAtualFormatada = formatarDataHora(dataAtual);

                if(chatIdMensagem == chatIdSelecionado){
                    primeiraMensagemCliente = true
                    inserirMensagemHtml('Cliente', dataHoraAtualFormatada, mensagemWebSocket.mensagem)
                }

                
            }

            if(mensagemWebSocket.tipoMensagem == 'chat progress'){
                console.log('xyz')
                console.log(mensagemWebSocket.chatId)

                let chatRemoverId = 'chat'+mensagemWebSocket.chatId
                let chatRemover = document.getElementById(chatRemoverId);
                chatRemover.classList.add('hide');

            }
            
            console.log("mensagem recebida metodo 1")
            
        };

    })
}



// conexaoWebSocket.addEventListener('message', (event) => {
//     console.log(event.data)

//     console.log("mensagem recebida")
// })


async  function abrirChat(chatId){

    //atualiza-chat-progress

    //remover bolinha do chat
    let tipoMensagem = 'chat progress';

    const dataWebSocket = {tipoMensagem: tipoMensagem, chatId: chatId}

    conexaoWebSocket.send(JSON.stringify(dataWebSocket))

    let data = { chatId: chatId}
    
    fetch("/api/atualiza-chat-progress.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response => response.json)
        .then(data => {
            
            console.log(data)
        })
        .catch(error => {
            alert('Erro na requisição:', error);
            console.error('Erro na requisição:', error);
        });

    chatIdSelecionado = chatId

    document.getElementById("chat-messages").innerHTML = ''

    localStorage.removeItem('adminChatId')
    localStorage.setItem("adminChatId", chatId);
    
    const mensagens = await chatMensagens(chatId);

    mensagens.map((mensagem)=>{

        primeiraMensagemCliente = true

        let remetente = '';

       if (mensagem.you_sent == true) {
            remetente = 'você'
       }else{
            remetente = 'Cliente'
       }

       inserirMensagemHtml(remetente, mensagem.created_at, mensagem.message)
    })
}

function chatsAbertos(){

    fetch("/api/chats-abertos.php", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(response => response.json())
    .then(data => {

        inserirCirculoChatHtml(data)
    })
    .catch(error => {
        alert('Erro na requisição:', error);
        console.error('Erro na requisição:', error);
    });
}

function enviarMensagem(){

    if(primeiraMensagemCliente){

        const mensagemConteudo = document.getElementById("inpt-mensagem").value
        const chatId           = localStorage.getItem("adminChatId");    
        const tipoMensagem     =  'nova mensagem'

        const data = {chatId: chatId , mensagem: mensagemConteudo};
        const dataWebSocket = {tipoMensagem: tipoMensagem, resourceIdAdminResposta: resourceId, resourceIdCliente: resourceIdCliente, mensagem: mensagemConteudo}

        fetch("/api/enviar-mensagem.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response => response.json)
        .then(data => {
            
            console.log(data)
        })
        .catch(error => {
            alert('Erro na requisição:', error);
            console.error('Erro na requisição:', error);
        });

        
        document.getElementById("inpt-mensagem").value = " "
        
        const dataAtual              = new Date();
        const dataHoraAtualFormatada = formatarDataHora(dataAtual);

        inserirMensagemHtml('você', dataHoraAtualFormatada, mensagemConteudo)

        conexaoWebSocket.send(JSON.stringify(dataWebSocket))

    }else{
        alert("Espere o cliente enviar uma mensagem primeiro!")
    }
}


function inserirMensagemHtml(remetente, dataEhora, mensagem){

    let elemento = ''

    if(remetente == 'você'){

        elemento = ` <div class="direct-chat-msg right">
                        <div class="direct-chat-info clearfix">
                            <span class="direct-chat-name pull-right">${remetente}</span>
                            <span class="direct-chat-timestamp pull-left">${dataEhora}</span>
                        </div>
                                
                        <img class="direct-chat-img" src="https://img.icons8.com/office/36/000000/person-female.png" alt="message user image">
                        
                        <div class="direct-chat-text">
                            ${mensagem}
                    </div>`

    }else{
        elemento = `<div class="direct-chat-msg">
                        <div class="direct-chat-info clearfix">
                            <span class="direct-chat-name pull-left">${remetente}</span>
                            <span class="direct-chat-timestamp pull-right">${dataEhora} </span>
                        </div>
                            
                        <img class="direct-chat-img" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="message user image">
                    
                        <div class="direct-chat-text">
                            ${mensagem}
                        </div>
                    </div>`   
    }

    document.getElementById("chat-messages").innerHTML += elemento
}

function inserirCirculoChatHtml(chats){
    
    chats.map((chat)=>{
        let corRandom = getRandomColor();
        const elemento = `<div class="circulo" onclick="abrirChat(${chat.id})" id="chat${chat.id}" style="background-color: ${corRandom}"></div>`
        document.getElementById("box-chat-circulo").innerHTML += elemento
    })
}

function insereCirculo(id){
   
    let corRandom = getRandomColor();
    const elemento = `<div class="circulo" onclick="abrirChat(${id})" id="chat${id}" style="background-color: ${corRandom}"></div>`
        document.getElementById("box-chat-circulo").innerHTML += elemento
}



function fecharChat(){

    const chat     = document.getElementById("chat");

    chat.classList.add('hide');
    chat.classList.remove('show');


    // const data = {chatId: chatId};

    // fetch("/api/fechar-chat.php", {
    // method: 'POST',
    // headers: {
    //     'Content-Type': 'application/json'
    // },
    // body: JSON.stringify(data)
    // })
    // .then(response => response.json)
    // .then(data => {
        
    //     localStorage.removeItem('chatId')
    //     document.getElementById("chat-messages").innerHTML = ""
    // })
    // .catch(error => {
    //     alert('Erro na requisição:', error)
    //     console.error('Erro na requisição:', error)
    // });
}


function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}