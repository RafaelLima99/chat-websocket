<?php

use React\EventLoop\Loop;

require("vendor/autoload.php");

class ClienteWebSocket 
{
    public function enviarMensagem()
    {

        $url = "ws://localhost:8080";
    
    \Ratchet\Client\connect($url)->then(function ($conn) {
        $conn->on('message', function ($msg) use ($conn) {
            echo "Received: {$msg}\n";
            $conn->close();
        });


            $conn->send(json_encode('showwwww2'));

        
    }, function ($e) {
        echo "Could not connect: {$e->getMessage()}\n";
    });


    }
}
    