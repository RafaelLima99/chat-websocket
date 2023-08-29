

let conexaoWebSocket = null
let resourceId = null


chatsAbertos()
teste()


function teste(){

    conexaoWebSocket = new WebSocket('ws://localhost:8080');

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

            if(mensagemWebSocket.tipoMensagem == 'novo chat'){
                insereCirculo(mensagemWebSocket.chatId)
            }elseif(mensagemWebSocket.tipoMensagem)
            console.log("mensagem recebida metodo 1")
            
        };

    })
}



conexaoWebSocket.addEventListener('message', (event) => {
    console.log(event.data)

    console.log("mensagem recebida")
})


async  function abrirChat(chatId){

    document.getElementById("chat-messages").innerHTML = ''

    localStorage.removeItem('adminChatId')
    localStorage.setItem("adminChatId", chatId);
    
    const mensagens = await chatMensagens(chatId);

    mensagens.map((mensagem)=>{

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

    console.log("e")
    
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

    const mensagemConteudo = document.getElementById("inpt-mensagem").value
    const chatId           = localStorage.getItem("adminChatId");    

    const data = {chatId: chatId , mensagem: mensagemConteudo};
    const dataWebSocket = {resourceId: resourceId, mensagem: mensagemConteudo}

    conexaoWebSocket.send(JSON.stringify(dataWebSocket))
    
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
        
        const elemento = `<div class="circulo" onclick="abrirChat(${chat.id})"></div>`
        document.getElementById("box-chat-circulo").innerHTML += elemento
    })
}

function insereCirculo(id){
    const elemento = `<div class="circulo" onclick="abrirChat(${id})"></div>`
        document.getElementById("box-chat-circulo").innerHTML += elemento
}