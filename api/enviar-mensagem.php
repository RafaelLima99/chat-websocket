<?php

require_once '../Controllers/ChatController.php';

$dados = json_decode(file_get_contents('php://input'), true);

$chatController = new ChatController();
$chatController->enviarMensagem($dados['chatId'], $dados['mensagem']);
