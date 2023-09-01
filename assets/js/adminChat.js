

let conexaoWebSocket = null
let resourceId = null
let resourceIdCliente = null
let chatIdSelecionado = null
let primeiraMensagemCliente = false
let resourceIdClientes = [];
let idCliente = null
let idClienteChatSelecionado = null




chatsAbertos()
iniciaConexao()


function iniciaConexao(){

    conexaoWebSocket = new WebSocket('wss://lsf99mtr78.execute-api.us-east-1.amazonaws.com/production');

    conexaoWebSocket.addEventListener('open', (event) => {

        conexaoWebSocket.send(JSON.stringify({
            action: 'receiveConnectionId'}))


        fetch("/api/user-logado.php", {
            method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                
                localStorage.setItem("meuIdAdmin", data);
        
            })
            .catch(error => {
                alert('Erro na requisição:', error);
                console.error('Erro na requisição:', error);
            });


    
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


                
                data = {
                    action: 'message',
                    body: {resourceIdAdminLogado: resourceId}
                }
                conexaoWebSocket.send(JSON.stringify(data))


                atualizaUserResourceId(resourceId)
            }

            if(mensagemWebSocket.tipoMensagem == 'novo chat'){

                let dadosChatObj = { idCliente: mensagemWebSocket.idCliente, chatId: mensagemWebSocket.chatId }

                inserirDadosChatLocalStorage(dadosChatObj)
                insereCirculo(mensagemWebSocket.chatId)
            }
            
            if(mensagemWebSocket.tipoMensagem == 'nova mensagem'){

                idCliente = mensagemWebSocket.clienteId

                
                console.log("entrou no if da nova mensagem")

                let dadosClienteObj = { resourceIdCliente: mensagemWebSocket.resourceId, chatId: mensagemWebSocket.chatId }
                          

                //let dadosClienteJsonString = JSON.stringify(dadosCliente)

                //console.log(dadosClienteJsonString)
                //======================================================
                //inserirDadosClienteLocalStorage(dadosClienteObj)
                //====================================================
                
                console.log(resourceIdClientes)

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

    //idClienteChatSelecionado

    let chatsConectados = JSON.parse(localStorage.getItem("chatsConectados"));  

    chatsConectados.map((chat) => {
        if(chat.chatId = chatId){
            idClienteChatSelecionado = chat.idCliente
        }
    })
    
    


    //atualiza-chat-progress

    //remover bolinha do chat
    let tipoMensagem = 'chat progress';

    
    const dataWebSocket = {
        action: 'message',
        body: {tipoMensagem: tipoMensagem, chatId: chatId}
    }

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
        // removeDadosChatsLocalStorage(data)
        inserirCirculoChatHtml(data)
    })
    .catch(error => {
        alert('Erro na requisição:', error);
        console.error('Erro na requisição:', error);
    });
}

async function enviarMensagem(){

    
      let resourceIdCliente = await getResourceId(idClienteChatSelecionado)
      console.log(resourceIdCliente)


    if(resourceIdCliente == null){

        console.log('b1')
        var clientesOnline = localStorage.getItem("clientesOnline");  
        var clientesOnlineObj =  JSON.parse(clientesOnline)
        clientesOnlineObj.map((cliente) => {
           
            console.log('b2')
            if(cliente.chatId == chatIdSelecionado){
                console.log('b3')
                console.log("o reoucer id é igual a: "+ cliente.resourceIdCliente)
            }
        })
    }

    if(resourceId == null){
        console.log('entrouuuuuuu')
        
    }

    if(primeiraMensagemCliente){

        const mensagemConteudo = document.getElementById("inpt-mensagem").value
        const chatId           = localStorage.getItem("adminChatId");    
        const tipoMensagem     =  'nova mensagem'
        const meuIdAdmin            =  localStorage.getItem("meuIdAdmin")
        const data = {chatId: chatId , mensagem: mensagemConteudo};

        
        const dataWebSocket = {
            action: 'message',
            body: {tipoMensagem: tipoMensagem, resourceIdAdminResposta: resourceId, resourceIdCliente: resourceIdCliente, idAdmin: meuIdAdmin, mensagem: mensagemConteudo}
            }

            console.log(dataWebSocket)

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


function inserirDadosChatLocalStorage(dadosChatObj){

    console.log('entrou no localestorage 00')

    if (!localStorage.getItem("chatsConectados")) {

        let ArrayDadosChatObj = JSON.stringify([dadosChatObj]);
        localStorage.setItem("chatsConectados", ArrayDadosChatObj);

    }else{
       console.log('entrou no localestorage')
    let clientesOnlineLocalStorage = localStorage.getItem('chatsConectados');

    let clientesOnlineLocalStorageObj = JSON.parse(clientesOnlineLocalStorage)

    clientesOnlineLocalStorageObj.push(dadosChatObj);

    let clientesOnlineLocalStorageString = JSON.stringify(clientesOnlineLocalStorageObj)

    localStorage.setItem('chatsConectados', clientesOnlineLocalStorageString);
   }
}



function atualizaUserResourceId(resourceId){

    let data = {resourceId: resourceId}

    fetch("/api/atualiza-user-resource-id.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response => response.json)
        .then(data => {
            
            // localStorage.removeItem('chatId')
            // document.getElementById("chat-messages").innerHTML = ""
        })
        .catch(error => {
            alert('Erro na requisição:', error)
            console.error('Erro na requisição:', error)
        });
}



// function getResourceId(id){

//     let data = {id: id}

//     fetch("/api/resource-id.php", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log("resource ID do usuario 2")
//             console.log(data)
//             console.log("aaaa")
//         })
//         .catch(error => {
//             alert('Erro na requisição:', error);
//             console.error('Erro na requisição:', error);
//     });

// }



async function getResourceId(id){
    
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


//  async function meuId(){

//     // fetch("/api/user-logado.php", {
//     //     method: 'GET'
//     //     })
//     //     .then(response => response.json())
//     //     .then(data => {
            
//     //         localStorage.setItem("meuId", data);
    
//     //     })
//     //     .catch(error => {
//     //         alert('Erro na requisição:', error);
//     //         console.error('Erro na requisição:', error);
//     //     });


//         try {
//             const response = await fetch('/api/user-logado.php', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//             });
    
//             if (!response.ok) {
//             throw new Error('Erro na requisição')
//             }
    
//             const responseData = await response.json()
//             return responseData;
    
//         } catch (error) {
//             console.error('Erro:', error)
//             throw error;
//         }


// }


// function removeDadosChatsLocalStorage(data){
//     const chatsConectados = JSON.parse(localStorage.getItem("chatsConectados"))
//     data.map((chatBanco) =>{
//         if(chatBanco.id)
//     })
    
// }


function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}