<?php


require_once '../Controllers/ChatController.php';

$dados = json_decode(file_get_contents('php://input'), true);

$chatController = new ChatController();
$idUserLogado = $chatController->clienteLogado();

header('Content-Type: application/json');
echo json_encode($idUserLogado);