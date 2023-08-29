<?php

session_start();

//verifica se o usuario já está logado
if ($_SESSION["codUserCliente"]) {
  header('Location: actions/chat-cliente.php');
}elseif ($_SESSION["codUserAdmin"]) {
  header('Location: actions/chat-admin.php');
}


//loga o usuário no sistema de acordo com a sua escolha de login
$login = isset($_GET['login']) ? $_GET['login'] : false;

if($login == 'user_comun'){

  $_SESSION["codUserCliente"]= 1;
  header('Location: actions/chat-cliente.php');

}elseif($login == 'admin'){
  $_SESSION["codUserAdmin"]= 2;
  header('Location: actions/chat-admin.php');

}


?>

<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">

    <title>Hello, world!</title>
  </head>
  <body style="background-color: rgb(192, 191, 191);">
    <div class="container">
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 mt-5">
                <div class="card">
                    <div class="card-header ">
                      Entrar Como
                    </div>
                    <div class="card-body">
                      <div class="mb-2">
                        <a href="index.php?login=user_comun" class="btn btn-primary">Usuário Comum</a>
                      </div>
                     
                      <div class="mb-2">
                        <a href="index.php?login=admin" class="btn btn-primary">Administrador</a>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Option 1: jQuery and Bootstrap Bundle (includes Popper) -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossorigin="anonymous"></script>

    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <!--
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js" integrity="sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+" crossorigin="anonymous"></script>
    -->
  </body>
</html>