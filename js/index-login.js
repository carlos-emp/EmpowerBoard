var app = angular.module('bitacora-login',[]);
app.controller("login-controller", function($scope, $http) {

  $scope.usuarios={};

  $scope.init=function(){
    if(Cookies.get('usuario')!=undefined){

        alert("Bienvenido/a "+Cookies.get('usuario'));
        window.location = "http://empowerlabs.com/proyectos/webapps/bitacora-movil/main.html";
    }
    else{
      $scope.getUsuarios();

    }

  };

  $scope.showModalRegister=function(){
    $('#loginModal').openModal();
  };

  $scope.closeModalRegister=function(){
    $('#loginModal').closeModal();
  }
  $scope.onRegister=function(){

    if($scope.userValidation()){
      var data = $('#form-alta-usuario').serialize();
      $('#loadingRegister').css('display', 'block');
      var url="http://alexrojas.cloudapp.net/web/api/bitacora/insertUser.php?"+data;
      // var url="http://localhost/BitacoraMovil/php/insertUser.php?"+data;
      $http.get(url).success(function(data) {
        $scope.register=data;
        $('#loadingRegister').css('display', 'none');
        document.getElementById("form-alta-usuario").reset();
        $scope.closeModalRegister();
        alert($scope.register.mensaje);
        document.getElementById("form-alta-usuario").reset();
      });

    }
    else{
      alert("Revisar el Wikiname");
    }
  }
  $scope.userValidation=function(){
    var wikiname=$("#wikiname-register").val();
    var encontrado=false;
    for (var i = 0; i < $scope.usuarios.length; i++) {
      if($scope.usuarios[i].nombre==wikiname){
        return true;
      }
    }
    return false;
  }

  $scope.getUsuarios = function() {
    $http.get('http://empowerlabs.com/proyectos/trackersAPI/getUsers.php').
    success(function(data) {
      $scope.usuarios = data;
    });
  };

  $scope.OnSignUp = function(){
    $('#loadingSignup').css('display', 'block');
    var data = $('#form-signup').serialize();
    // var url="http://localhost/BitacoraMovil/php/signup.php?"+data;
    var url="http://alexrojas.cloudapp.net/web/api/bitacora/signup.php?"+data;

    $http.get(url).success(function(data) {
      $('#loadingSignup').css('display', 'none');
      $scope.sesion=data;
      if($scope.sesion.resultado=="true"){

        Cookies.set('usuario', $scope.sesion.usuario, { expires: 7, path: '' });
        window.location = "http://empowerlabs.com/proyectos/webapps/bitacora-movil/main.html";
      }

        alert($scope.sesion.mensaje);

    });
  }
});
