<?php

require_once '../Controllers/ChatController.php';

$dados = json_decode(file_get_contents('php://input'), true);

$chatController = new ChatController();

$resposta = $chatController->verificaChatOpen($dados['chatId']);

header('Content-Type: application/json');
echo json_encode(['chatOpen' => $resposta]);
