let conexaoWebSocket = null
let resourceId = null
let resourceIdAdmin = null
let idAdmin = null

if (localStorage.getItem("chatId")) {
    verificaChatOpen()
}


function abrirChat(){

    fetch("/api/abrir-chat.php", {
    method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        
        let chatId = data.chatId;

        localStorage.setItem("chatId", chatId);
        exibirChat()
        // setInterval(verificaChatOpen, 6000)

    })
    .catch(error => {
        alert('Erro na requisição:', error);
        console.error('Erro na requisição:', error);
    });


    conexaoWebSocket = new WebSocket('wss://lsf99mtr78.execute-api.us-east-1.amazonaws.com/production');

    conexaoWebSocket.addEventListener('open', (event) => {
    
        console.log('conexão estabelecida pelo codigo do alex')


        conexaoWebSocket.send(JSON.stringify({
            action: 'receiveConnectionId'}))

        conexaoWebSocket.addEventListener('message', (event) => {
            console.log(event.data)
            console.log("mensagem recebida")
            

            let mensagemWebSocket = JSON.parse(event.data)

            if(mensagemWebSocket.tipoMensagem == 'nova mensagem'){
                idAdmin = mensagemWebSocket.idAdmin
                const dataAtual              = new Date();
                const dataHoraAtualFormatada = formatarDataHora(dataAtual);
                resourceIdAdmin              = mensagemWebSocket.resourceIdAdminResposta

                inserirMensagemHtml('Admin', dataHoraAtualFormatada, mensagemWebSocket.mensagem)
            }

            if(mensagemWebSocket.tipoMensagem == 'resourceId'){
                console.log('entrou no recorce')
                resourceId = mensagemWebSocket.resourceId
                console.log("==================")
                console.log(resourceId)
                atualizaUserResourceId(resourceId)

            }
        })


        fetch("/api/user-logado.php", {
            method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                
                localStorage.setItem("meuId", data);
        
            })
            .catch(error => {
                alert('Erro na requisição:', error);
                console.error('Erro na requisição:', error);
            });


        

        const chatId = localStorage.getItem("chatId");
        const tipoMensagem = 'novo chat'
        const meuId = localStorage.getItem("meuId");

        var dataWebSocket = { 
            action: 'message',

            body: {
                tipoMensagem: tipoMensagem, chatId: chatId, idCliente: meuId
            }
        }

        conexaoWebSocket.send(JSON.stringify(dataWebSocket))


    })
}

function fecharChat() {

    const chat     = document.getElementById("chat");
    const iconChat = document.getElementById("icon-chat");

    chat.classList.add('hide');
    chat.classList.remove('show');

    iconChat.classList.remove('hide');
    iconChat.classList.add('show');

    const chatId = localStorage.getItem("chatId");
    const data = {chatId: chatId};

    fetch("/api/fechar-chat.php", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json)
    .then(data => {
        
        localStorage.removeItem('chatId')
        document.getElementById("chat-messages").innerHTML = ""
    })
    .catch(error => {
        alert('Erro na requisição:', error)
        console.error('Erro na requisição:', error)
    });
}

async function enviarMensagem()
{

    if(idAdmin){
       resourceIdAdmin = await testeL(idAdmin)
    }


    const chatId           = localStorage.getItem("chatId");
    const mensagemConteudo = document.getElementById("inpt-mensagem").value
    const tipoMensagem     = 'nova mensagem';
    const meuId            = localStorage.getItem("meuId");

   
    
    const data          = {chatId: chatId , mensagem: mensagemConteudo}

    const dataWebSocket = {
        action: 'message',
        body: { tipoMensagem: tipoMensagem, resourceId: resourceId, resourceIdAdmin: resourceIdAdmin, 
                chatId:chatId, mensagem: mensagemConteudo, clienteId: meuId, resourceIdAdminResposta: null 
            }
    }

    console.log(JSON.stringify(dataWebSocket))
        

    

    // let novoDataWebSocket = {
    //     action: 'receiveConnectionId',
    //     body: dataWebSocket
    // }

    

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

async function verificaChatOpen()
{
    
    const chatId = localStorage.getItem("chatId");
    const data = {chatId: chatId};

    try {
        const response = await fetch('/api/verificar-open-chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (!response.ok) {
        throw new Error('Erro na requisição');
        }

        const responseData = await response.json();

        if(responseData.chatOpen == true){

            exibirChat()
            
            const mensagens = await chatMensagens(chatId)

            mensagens.map((mensagem) => {

                let remetente = '';

                if (mensagem.you_sent == true) {
                        remetente = 'você'
                }else{
                        remetente = 'Admin'
                }

                inserirMensagemHtml(remetente, mensagem.created_at, mensagem.message)
            })
        }

    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }

    testeRecarregar()

}

function exibirChat(){
    
    const iconChat = document.getElementById("icon-chat");
    const chat     = document.getElementById("chat");

    iconChat.classList.remove('show');
    iconChat.classList.add('hide');

    chat.classList.remove('hide');
    chat.classList.add('show');
        
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



function testeRecarregar(){

    conexaoWebSocket = new WebSocket('wss://lsf99mtr78.execute-api.us-east-1.amazonaws.com/production');
    
    conexaoWebSocket.addEventListener('message', (event) => {
        console.log(event.data)
        console.log("mensagem recebida")
        

        let mensagemWebSocket = JSON.parse(event.data)

        if(mensagemWebSocket.tipoMensagem == 'nova mensagem'){
            const dataAtual              = new Date();
            const dataHoraAtualFormatada = formatarDataHora(dataAtual);

            inserirMensagemHtml('Admin', dataHoraAtualFormatada, mensagemWebSocket.mensagem)
        }

        if(mensagemWebSocket.tipoMensagem == 'resourceId'){
            console.log('entrou no recorce')
            resourceId = mensagemWebSocket.resourceId
        }
    })
}


function atualizaUserResourceId(resourceId){
    console.log("acessou")

    let data = {resourceId: resourceId}

    console.log(data)

    fetch("/api/atualiza-user-resource-id.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(data => {
            
            console.log(data)
            
        })
        .catch(error => {
            alert('Erro na requisição:', error)
            console.error('Erro na requisição:', error)
        });
}



function getResourceId(id){

    let data = {id: id}

    fetch("/api/resource-id.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log("resource ID do usuario 2")
            console.log(data)
            console.log("aaaa")
        })
        .catch(error => {
            alert('Erro na requisição:', error);
            console.error('Erro na requisição:', error);
    });

}


async function testeL(id){
    
    let data = {id: id}

    try {
        const response = await fetch('/api/resource-id.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (!response.ok) {
        throw new Error('Erro na requisição')
        }

        const responseData = await response.json()
        return responseData.resourceId;

    } catch (error) {
        console.error('Erro:', error)
        throw error;
    }
}








// async function chatMensagens(chatId) {

// const data = {chatId: chatId};

//     try {
//         const response = await fetch('/api/mensagens-chat.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//         throw new Error('Erro na requisição');
//         }

//         const responseData = await response.json();
//         return responseData;
//     } catch (error) {
//         console.error('Erro:', error);
//         throw error;
//     }
// }



