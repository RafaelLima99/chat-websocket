<?php

require_once (dirname(__DIR__, 1) . "/Database/Banco.php");
class ChatMessages 
{
    private $bd;
    private $chatId;
    private $senderId;
    private $message;

    public function __construct()
    {
        $this->bd = new Banco();
    }

    public function create($dados)
    {
        $this->chatId   = $dados['chatId'];
        $this->senderId = $dados['senderId'];
        $this->message  = $dados['message'];

        $sql = "INSERT INTO `chat_messages` (chat_id, sender_id, message) VALUES ($this->chatId, $this->senderId, '$this->message')";
        $this->bd->query($sql);
    }

    public function chatMensagens($chatId)
    {
        $this->chatId = $chatId;

        $sql = "SELECT * FROM `chat_messages` WHERE chat_id = $this->chatId";
        $this->bd->query($sql);
        return $this->bd->result();
    }

}

