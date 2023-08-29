<?php

require_once (dirname(__DIR__, 1). "/Controllers/ChatController.php");

$chatController = new ChatController();
$chatId = $chatController->abrirChat();

header('Content-Type: application/json');
echo json_encode(['chatId' => $chatId]);