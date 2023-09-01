<?php

require_once '../Controllers/ChatController.php';

$dados = json_decode(file_get_contents('php://input'), true);

$chatController = new ChatController();

$resourceId = $chatController->resourceIdUser($dados['id']);

header('Content-Type: application/json');
echo json_encode(['resourceId' => $resourceId]);