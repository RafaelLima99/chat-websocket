<?php

require_once '../Controllers/ChatController.php';

$chatController = new ChatController();

$resposta = $chatController->chatsAbertos();

header('Content-Type: application/json');
echo json_encode($resposta);




