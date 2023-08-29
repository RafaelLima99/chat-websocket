<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require_once(__DIR__ ."/actions/websocket/Methods.php");
require("vendor/autoload.php");

    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new Methods()
            )
        ),
        8080
    );

    $server->run();