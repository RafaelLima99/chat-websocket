<?php

require_once (dirname(__DIR__, 1) . "/Database/Banco.php");

class User {
    private $bd;

    private $codUser;
    private $resourceId;


    public function __construct()
    {
        $this->bd = new Banco();
    }

    public function updateResourceId($codUser, $resourceId)
    {
        $this->codUser    = $codUser;
        $this->resourceId = $resourceId;

        $sql = "UPDATE users SET resourceId = '$this->resourceId' WHERE codUser = $this->codUser";

        $this->bd->query($sql);
    }

    public function getResourceIdUser($codUser)
    {
        $this->codUser = $codUser;

        $sql = "SELECT resourceId FROM `users` WHERE `codUser` =  $this->codUser";
        $this->bd->query($sql);

        return $this->bd->result();

    }
}