<?php


use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require_once 'Controllers/ChatController.php';

class Methods implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";

        $resourceId = $conn->resourceId;

        $dados = ['tipoMensagem' => 'resourceId', 'resourceId' => $resourceId];
        $dados = json_encode($dados);
        
        $conn->send($dados);

        // $chatControlller = new ChatController();
        // $chatControlller->atualizaUserResourceId($conn->resourceId);


    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
       // echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            //, $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');


        $objMsg = json_decode($msg);


        if($objMsg->tipoMensagem == 'novo chat'){
            
            foreach ($this->clients as $client) {
                 if ($client->tipo == 'admin') {

                    $client->send($msg);
                }
            }
        }

        if($objMsg->tipoMensagem == 'chat progress'){
            foreach ($this->clients as $client ) {
                 if ($client->tipo == 'admin'  && $from !== $client) {

                    $client->send($msg);
                }
            }
        }


        //echo $objMsg->tipoMensagem;
        if($objMsg->resourceIdAdminLogado){
            echo "admin logado 2";
            foreach ($this->clients as $client) {
                if($client->resourceId == $objMsg->resourceIdAdminLogado){
                    
                    $client->tipo = 'admin';

                }
            }

            
        }

        if($objMsg->tipoMensagem == 'nova mensagem'){

            if($objMsg->resourceIdCliente){

                echo "entrou no if ";

                $resourceIdCliente = $objMsg->resourceIdCliente;


                foreach ($this->clients as $client) {
                    // if ($from !== $client) {
                    //     // The sender is not the receiver, send to each client connected
                    //     $client->send($msg);
                    // }
                    echo "entrou no for ";
                    if($client->resourceId == $resourceIdCliente){
                        echo "entrou no if de enviar ";
                        $client->send($msg);
                    }
                    
                }

            }
            
            
            if($objMsg->resourceIdAdmin){

               $resourceIdAdmin = $objMsg->resourceIdAdmin;

                foreach ($this->clients as $client) {
                    if ($client->resourceId == $resourceIdAdmin) {
                        // The sender is not the receiver, send to each client connected
                        $client->send($msg);
                    }
                    
                }
            }


            if (!$objMsg->resourceIdAdmin && !$objMsg->resourceIdAdminResposta) {

                foreach ($this->clients as $client) {
                    if ($client->tipo == 'admin') {
                        // The sender is not the receiver, send to each client connected
                        $client->send($msg);
                    }
                    
                }
            }

            
        }


        var_dump($msg);
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}
