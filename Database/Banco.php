<?php

require_once (dirname(__DIR__, 1)."/vendor/autoload.php");
Class Banco 
{
    private $dbname;
    private $host;
    Private $senha;
    private $user;

    private $pdo;
    private $linhas;
    private $arrayDados;

    public function __construct()
    {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
        $dotenv->load();

        $this->dbname  = $_ENV['DB_DATABASE'];
        $this->host    = $_ENV['DB_HOST'];
        $this->senha   = $_ENV['DB_PASSWORD'];
        $this->user    = $_ENV['DB_USERNAME'];

        try {
            $this->pdo = new PDO("mysql:dbname=" . $this->dbname . ";host=" . $this->host, $this->user , $this->senha);
            $this->pdo->exec("set names utf8");
        } catch (PDOException $e) {
            echo 'Erro, não foi possível conectar ao banco de dados: ' . $e->getMessage();
            die();
        }
    }

    public function query($sql)
    {
        try {

            $query            = $this->pdo->query($sql);
            $this->linhas     = $query->rowCount();
            $this->arrayDados = $query->fetchAll();

        } catch (PDOException $e) {
            echo 'Erro na Query: ' . $e->getMessage();
        }
    }

    public function lastId()
    {
        return $this->pdo->lastInsertId();
    }

    public function linhas()
    {
        return $this->linhas;
    }

    public function result()
    {
        return $this->arrayDados;
    }


}