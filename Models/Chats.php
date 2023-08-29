<?php

require_once (dirname(__DIR__, 1) . "/Database/Banco.php");
class Chats
{
    private $bd;
    private $id;
    private $userId;
    private $guid;
    private $status;

    public function __construct()
    {
        $this->bd = new Banco();
    }
    public function create($dados)
    {
        $this->userId = $dados['user_id'];
        $this->guid   = $dados['guid'];
        $this->status = $dados['status'];

        $sql = "INSERT INTO chats(user_id, guid, status) VALUES($this->userId,  '$this->guid',  '$this->status')";
        $this->bd->query($sql);
        return $this->bd->lastId();
    }

    public function chatsAbertos()
    {
        $sql = "SELECT * FROM `chats` WHERE status = 'open'";
        $this->bd->query($sql);

        return $this->bd->result();
    }

    public function fecharChat($id)
    {
        $this->id = $id;

        $sql = "UPDATE chats SET status = 'close' WHERE id = $this->id";
        $this->bd->query($sql);
    }

    public function getChat($idChat)
    {
        $this->id = $idChat;
        $sql = "SELECT * FROM chats WHERE id = $this->id";
        $this->bd->query($sql);
        return $this->bd->result();
    }
}