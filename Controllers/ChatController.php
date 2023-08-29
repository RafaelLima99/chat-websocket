<?php

// Carrega o autoload do composer
//require_once 'vendor/autoload.php';
require_once (dirname(__DIR__, 1) . "/Models/ChatMessages.php");
require_once (dirname(__DIR__, 1) . "/Models/Chats.php");

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
Class ChatController 
{
    public function chatAdmin()
    {

        // $loader = new FilesystemLoader('../Resources/Views');
        // $twig   = new Environment($loader);

        // echo $twig->render('chatAdmin.twig');

        require('../Resources/Views/chatAdmin.html');

    }
    public function chatCliente()
    {

        // $loader = new FilesystemLoader('../Resources/Views');
        // $twig   = new Environment($loader);

        // echo $twig->render('chatCliente.twig');

        require('../Resources/Views/chatCliente.html');

    }

    public function abrirChat()
    {
        
        $dados = [
            'user_id' => $this->clienteLogado(), 
            'guid'    => '123456789012345678901234567890123456',
            'status'  => 'open'
           ];

        $chats = new Chats();

       $chatId = $chats->create($dados);

        session_start();
        $_SESSION['chatId'] = $chatId;
       
      return $chatId;
    }

    public function enviarMensagem($chatId, $message)
    {
        session_start();
        
        $dados = [
            'chatId'  => $chatId,
            'senderId'=> $this->clienteLogado(),
            'message' => $message
            ];

        $chatMessages = new ChatMessages();
        $chatMessages->create($dados);
    }

    public function fecharChat($chatId)
    {
        $chats = new Chats();
        $chats->fecharChat($chatId);
       
    }

    public function mensagens()
    {
        session_start();
        $chatId = $_SESSION['chatId'];

        if($chatId == null){
            return false;
        }
        $chatMessages = new ChatMessages();

        $mensagens = $chatMessages->chatMensagens($chatId);

        foreach ($mensagens as $key => $mensagen) {

            $idClienteLogado = $this->clienteLogado();

            $date = new DateTime($mensagen['created_at']);

            $mensagens[$key]['created_at'] = $date->format('d/m/Y H:i');
                                              

            if($idClienteLogado == $mensagen['sender_id']){
                $mensagens[$key]['you_sent'] = true;
            }else{
                $mensagens[$key]['you_sent'] = false;
            }
            
        }

        return $mensagens;
    }

    public function verificaChatOpen($chatId)
    {
        $chats = new Chats();
        $chat = $chats->getChat($chatId);
        
        if($chat[0]['status'] == 'open'){
            return true;
        }else{
            return false;
        }
        
    }

    public function chatsAbertos()
    {
        $chats = new Chats();
        return $chats->chatsAbertos();
    }


    public function mensagensPorChat($chatId)
    {
        $chatMessages = new ChatMessages();

        $mensagens = $chatMessages->chatMensagens($chatId);

        foreach ($mensagens as $key => $mensagen) {

            $idClienteLogado = $this->clienteLogado();

            $date = new DateTime($mensagen['created_at']);

            $mensagens[$key]['created_at'] = $date->format('d/m/Y H:i');
                                              

            if($idClienteLogado == $mensagen['sender_id']){
                $mensagens[$key]['you_sent'] = true;
            }else{
                $mensagens[$key]['you_sent'] = false;
            }
            
        }

        return $mensagens;
    }

    public function clienteLogado()
    {
        session_start();

        if($_SESSION['codUserCliente']){
            $idClienteLogado = $_SESSION['codUserCliente'];
        }elseif($_SESSION['codUserAdmin']){
            $idClienteLogado = $_SESSION['codUserAdmin'];
        }
        // $idClienteLogado = $_SESSION['codUser'];
        return $idClienteLogado;
    }

    public function atualizaUserResourceId($resourceId)
    {
       $codClienteLogado = $this->clienteLogado();

        $user = new User();
        
        $user->updateResourceId($codClienteLogado, $resourceId);

    }

    public function atualizaChatProgress($chatId)
    {
        $chats = new Chats();
        $chats->atualizaChatProgress($chatId);
    }

  

}

