
var user = Cookies.get('usuario');
var conn = "";
var conexiones = 0;
var selectedTarget = "";
var selectedConversacion={};
var selectedURL='';
var selectedChatPerson = "";
var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var monthNum = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var d = new Date();

var app = angular.module('bitacora-movil', ['onsen']);
app.controller("body-controller", function($scope, $http) {
  $scope.fechaActual=d.getFullYear()+'-'+ monthNum[d.getMonth()]+'-'+d.getDate();
  $scope.actividades = {};
  $scope.usuarios = {};
  $scope.conversaciones = [];
  $scope.selectedChats = {};
  $scope.user2 = user;
  $scope.flag=true;
  $scope.flagOpcion=true;
  $scope.notificaciones="";

  $scope.fecha="Hoy";


  // =====================   notificaciones

  $scope.notificacion=function(mensaje){
    Materialize.toast(mensaje, 3000);
  }

  $scope.deleteNotification=function(id){
    delete $scope.notificaciones[id];
  }
  $scope.addNotificacion=function(notificacion){

    if($scope.notificaciones=""){
      $scope.notificaciones=notificacion;
    }
    else{
      $scope.notificaciones = $scope.notificaciones.concat(notificacion);

    }
    var not=notificacion.mensaje+" - "+notificacion.hora;
    $scope.notificacion(not);
  };

  // ==================== cargar panel global ============================
  $scope.actividadesDashboard=[];
  $scope.llamarDash = function() {
    $http.get('http://alexrojas.cloudapp.net/web/api/bitacora/getActivities.php').
    success(function(data) {
      $scope.actividadesDashboard = data.detail;
    });
  };

  $scope.favoritos=[];
  // ==================== favoritos ============================
  $scope.favoritos=[];
  $scope.getFavs= function(){
    $http.get('http://alexrojas.cloudapp.net/web/chat/myFavs.php?me='+$scope.user2).success(function(data) {
      $scope.favoritos = data;
    });
  };
  $scope.getFavs();
  // ==================== pop over menu ============================
  $scope.toggleSortMenu=function(){
    if($scope.flag){
      $scope.hideSortMenu();
    }
    else{
      $scope.showSortMenu();
    }

  };
  $scope.showSortMenu=function(){
    $('#sort-menu').fadeIn();
    $scope.flag=true;
  };
  $scope.hideSortMenu=function(){
    $('#sort-menu').fadeOut();
    $scope.flag=false;
  };
  // ==================== end pop over menu ============================

  $scope.getConver = function() {
    $http.get('http://alexrojas.cloudapp.net/web/chat/myChats.php?me=' + $scope.user2).success(function(data) {
      $scope.conversaciones = data;
    });
  };
  $scope.getConver();
  $scope.order = 'categoria';
  $scope.dia = d.getDate();
  if ($scope.dia < 10) {
    $scope.dia = '0' + $scope.dia;
  }
  $scope.dateTop = {
    value: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    strVal: d.getFullYear() + '-' + monthNum[d.getMonth()] + '-' + $scope.dia
  };
  $scope.changeDate = function() {
    var tmp = $('#datePicker').val().split("-");
    //alert(tmp[0]);
    $scope.dateTop = {
      value: new Date(tmp[0], tmp[1] - 1, tmp[2]),
      strVal: $('#datePicker').val()
    };
    if($scope.dateTop.strVal==d.getFullYear() + '-' + monthNum[d.getMonth()] + '-' + $scope.dia){
      $scope.fecha="Hoy";
    }
    else {
      $scope.fecha=$scope.dateTop.strVal;
    }
  };
  $scope.llamar = function() {

    $http.get('http://alexrojas.cloudapp.net/web/api/bitacora/getActivities.php?user='+$scope.user2).
    success(function(data) {
      $scope.actividades = data;

      $scope.llamarDash();
    });


  };
  $scope.getUsuarios = function() {
    $http.get('http://empowerlabs.com/proyectos/trackersAPI/getUsers.php').
    success(function(data) {
      $scope.usuarios = data;
    });

  };

  $scope.findUsuarioURLimage = function(wikiName) {
    var finalThum = "img/fondo-fantasma.png";
    for (var i = 0; i < $scope.usuarios.length; i++) {
      if ($scope.usuarios[i].nombre === wikiName) {
        finalThum = $scope.usuarios[i].image;
        break;
      }
    }
    return finalThum;
  };
  $scope.enviarForm = function() {
    $('#loading').css('display', 'block');

    var date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();

    var url = "http://alexrojas.cloudapp.net/web/api/bitacora/insert.php";
    // the script where you handle the form input.
    var data = $('#form-alta-actividad').serialize() + '&' + $.param({
      from: $scope.user2,
      to: "",
      date: d.getFullYear() + '-' + monthNum[d.getMonth()] + '-' + $scope.dia,
      topic: '',
      lab: '',
      estatus: '0'
    });
    $.ajax({
      type: "POST",
      url: url,
      data: data, // serializes the form's elements.
      success: function(data) {
        //$('#new').fadeOut();
        document.getElementById("form-alta-actividad").reset();
        $scope.closeModalAlta();
        $('#loading').css('display', 'none');
        $scope.llamar();
        // show response from the php script.
      }
    });
  };
  //alert($scope.findUsuarioURLimage('JoseRojas'));


  ons.ready(function() {
    // Init code here






    $scope.llamar();
    $scope.getUsuarios();
    $scope.hideSortMenu();


    if($scope.user2==undefined){
      alert("Inicie sesión para continuar");
      window.location = "http://empowerlabs.com/proyectos/webapps/bitacora-movil/";
    }
    var not={"mensaje":"Bienvenido/a "+$scope.user2,"fecha":$scope.fechaActual,"hora":d.getHours() + ':' + d.getMinutes(),"foto":$scope.findUsuarioURLimage($scope.user2)};
    $scope.addNotificacion(not);

    // $scope.notificacion("Bienvenido/a "+$scope.user2);

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });


    start = function(websocketServerLocation) {
      if ($scope.conexiones > 0) {
        $scope.conn.close();
      }
      conn = new WebSocket(websocketServerLocation);
      conexiones++;
      //try to reconnect in 5 minutes
      setTimeout(function() {
        start(websocketServerLocation);
      }, 300000);

      conn.onopen = function(e) {
        console.log("Connection established!" + e);
      };
      conn.onclose = function(e) {
        console.log("Connection closed!" + e);
      };
      conn.onmessage = function(e) {
        //console.log("mensaje: " + e.data);
        $scope.json = e.data;
        $scope.json = jQuery.parseJSON($scope.json);
        var quien = $scope.json.target.split('-');
        if ($scope.json.type === "getConver") {
          if (quien[0] === $scope.user2 || quien[1] === $scope.user2) {
            $scope.selectedChats = $scope.json.chats;
            //console.log("mensaje: " + e.data);
            $scope.llamarChats();
            $scope.$apply(function() {
              $(".chat").scrollTop($(".chat")[0].scrollHeight);
            });
            $(".chat").scrollTop($(".chat")[0].scrollHeight);
          }
        } else {
          if ($scope.json.type === "send") {
            if (quien[0] === $scope.user2 || quien[1] === $scope.user2) {
              var clase = 'you';
              var objetivo = $scope.json.sent.para;
              if ($scope.json.sent.de !== $scope.user2) {
                clase = "me";
                objetivo = $scope.json.sent.de;
                //console.log(objetivo);
                $(".chat").append('<div class="bubble '+clase+'">'+$scope.json.mensaje+'<img src="'+$scope.findUsuarioURLimage(objetivo)+'" class="circle" style="width:20px; height:20px; position: absolute; top:-10px; left: -5px">  <div class="timeline-date">'+d.getHours() + ':' + d.getMinutes() +'</div></div>');
              } else {
                $(".chat").append('<div class="bubble '+clase+'">'+$scope.json.mensaje+'<img src="'+$scope.findUsuarioURLimage($scope.user2)+'" class="circle" style="width:20px; height:20px; position: absolute; bottom:-10px; right: -5px">  <div class="timeline-date">'+d.getHours() + ':' + d.getMinutes() +'</div></div>');
                //$('#' + json.target).text("0");
              }
              $(".chat").scrollTop($(".chat")[0].scrollHeight);
            }
          }
        }
      };
    };
    start('ws://alexrojas.cloudapp.net:9000');
  });
  $scope.showModalAlta=function(){
    $scope.hideSortMenu();
    $("#modal-alta").fadeIn();
  }
  $scope.closeModalAlta=function(){
    $("#modal-alta").fadeOut();
  }

  $scope.showModalCalendario=function(){
    $scope.hideSortMenu();
    $("#modal-calendario").fadeIn();
  }
  $scope.closeModalCalendario=function(){
    $("#modal-calendario").fadeOut();
  }
  $scope.lanzarCalendario = function() {
    $('.fixed-action-btn').closeFAB();
    $scope.ons.navigator.pushPage('calendario.html', {
      animation: "fade"
    });
  };
  $scope.lanzarFrame= function(idActividad){
    selectedURL=idActividad;
    $scope.ons.navigator.pushPage('webFrame.html');
  };
  $scope.lanzarMessageboard = function() {
    $('.fixed-action-btn').closeFAB();
    $scope.ons.navigator.pushPage('MessageBoard.html', {
      animation: "fade"
    });
  };
  $scope.lanzarChat = function() {
    $('.fixed-action-btn').closeFAB();
    $scope.ons.navigator.pushPage('chat.html', {
      animation: "fade"
    });
  };
  $scope.lanzarConversacion = function(conversacion) {
    selectedConversacion=conversacion;
    var arrTarget = [$scope.user2, conversacion.nombre];
    arrTarget.sort();
    arrTarget.reverse();
    // selectedChatPerson=arrTarget[0];
    // if(selectedTarget==$scope.user2){
    //   selectedChatPerson=arrTarget[1];
    // }
    selectedChatPerson=conversacion.nombre;



    console.log(selectedChatPerson);
    // console.log(arrTarget[0]+arrTarget[1]);
    //ws.$emit('onMessage', JSON.stringify({"type":"getConver","chatTarget":"VictorCastillo-JoseRojas","from":"alexrojas","to":"JoseRojas","message":"hola"})); // it sends the event 'hello' with data 'world'
    selectedTarget = arrTarget[0] + '-' + arrTarget[1];
    $scope.ons.navigator.pushPage('conversacion.html', {
      animation: "slide"
    });
  };
  $scope.llamarChats = function() {
    $scope.selectedChat = $scope.selectedChats;
  };
  $scope.llamarChats();
  $scope.regresar = function() {
    $scope.ons.navigator.popPage();
  };
  $scope.cerrarEntregable=function(){
    $("#myframe").attr("src","http://empowerlabs.com/proyectos/webapps/bitacora-movil/img/loading.gif");
    $scope.regresar();
  }
  $scope.cerrarOpcion = function() {

    Cookies.remove('usuario', { path: '' });
    window.location = "http://empowerlabs.com/proyectos/webapps/bitacora-movil/";

  };


  $scope.toggleOpcion = function(){
    if($scope.flagOpcion){
      $('.fixed-action-btn').openFAB();
      $scope.flagOpcion=false;
    }
    else{
      $('.fixed-action-btn').closeFAB();
      $scope.flagOpcion=true;
    }
  }

});

app.controller("ActividadesController", function($scope, $http) {

  $scope.order="categoria";
  $scope.orderDash="categoria";
  // ==================== Orden ============================

  $scope.setOrder = function(orderCode) {
    switch (orderCode) {
      case 0:
      if ($scope.order == 'id') {
        $scope.order = '-id';
      } else {
        $scope.order = 'id';
      }
      break;
      case 1:
      if ($scope.order == 'color') {
        $scope.order = '-color';
      } else {
        $scope.order = 'color';
      }
      break;
      case 2:
      if ($scope.order == 'para') {
        $scope.order = '-para';
      } else {
        $scope.order = 'para';
      }
      break;
      case 3:
      if ($scope.order == 'tiempo') {
        $scope.order = '-tiempo';
      } else {
        $scope.order = 'tiempo';
      }
      break;
      case 4:
      if ($scope.order == 'categoria') {
        $scope.order = '-categoria';
      } else {
        $scope.order = 'categoria';
      }
      break;
      case 5:
      if ($scope.order == 'prioridad') {
        $scope.order = '-prioridad';
      } else {
        $scope.order = 'prioridad';
      }
      break;
      default:

    }
  };

  $scope.setOrderDash = function(orderCode) {
    switch (orderCode) {
      case 0:
      if ($scope.orderDash == 'id') {
        $scope.orderDash = '-id';
      } else {
        $scope.orderDash = 'id';
      }
      break;
      case 1:
      if ($scope.orderDash == 'color') {
        $scope.orderDash = '-color';
      } else {
        $scope.orderDash = 'color';
      }
      break;
      case 2:
      if ($scope.orderDash == 'para') {
        $scope.orderDash = '-para';
      } else {
        $scope.orderDash = 'para';
      }
      break;
      case 3:
      if ($scope.orderDash == 'tiempo') {
        $scope.orderDash = '-tiempo';
      } else {
        $scope.orderDash = 'tiempo';
      }
      break;
      case 4:
      if ($scope.orderDash == 'categoria') {
        $scope.orderDash = '-categoria';
      } else {
        $scope.orderDash = 'categoria';
      }
      break;
      case 5:
      if ($scope.orderDash == 'prioridad') {
        $scope.orderDash = '-prioridad';
      } else {
        $scope.orderDash = 'prioridad';
      }
      break;
      case 6:
      if ($scope.orderDash == 'from') {
        $scope.orderDash = '-from';
      } else {
        $scope.orderDash = 'from';
      }
      break;
      default:

    };
  };


  $scope.findActivity=function(id){
    for(var i = 0; i < $scope.actividades.detail.length; i++)
    {
      if($scope.actividades.detail[i].id == id){
        $scope.selectedActividad=$scope.actividades.detail[i];
        $("#dateEdit").val($scope.selectedActividad.fecha);
        return true;
      }
    }
    return false;
  };
  $scope.editActivity=function(id){
    if($scope.findActivity(id)){

      $scope.showModalEdit();
    }
  };

  $scope.showEntregable=function(id){
    if($scope.findActivity(id)){
        alert($scope.selectedActividad.entregable);
      entregable.show();
    }
  };
  $scope.closeEntregable=function(){
    entregable.hide();
  };

  $scope.showModalEdit=function(){
    $scope.hideSortMenu();
    $("#modal-edit").fadeIn();

  };
  $scope.closeModalEdit=function(){
    $("#modal-edit").fadeOut();
  };


  $scope.onUpdate=function(){

    if($("#dateEdit").val==""||$("#dateEdit").val==null){

    }
    else{


      var data = $('#form-edit-actividad').serialize() + '&' + $.param({
        id: $scope.selectedActividad.id,

      });
      $('#loadingEdit').css('display', 'block');

      $.ajax({
        url: 'http://alexrojas.cloudapp.net/web/api/bitacora/updateTotal.php',
        type: 'POST',
        data: data,
        success: function(data) {
          $scope.closeModalEdit();
          $('#loadingEdit').css('display', 'none');
          $scope.llamar();

        }
      });

    };


  }
});

app.controller("ChatController", function($scope, $http) {

});

app.controller('FrameController',function($scope,$http){
  $scope.url=selectedURL;

    $('#loading').addClass('fa-spin');
  document.getElementById("myframe").onload = function() {
    $('#loading').removeClass('fa-spin');
};
  $('#myframe').attr('src', ''+selectedURL);
});

app.controller("ContactosController", function($scope, $http) {
  $scope.lanzarConversacionContactos=function(para){

    var arrTarget = [$scope.user2, para];
    arrTarget.sort();
    arrTarget.reverse();
    // selectedChatPerson=arrTarget[0];
    // if(selectedTarget==$scope.user2){
    //   selectedChatPerson=arrTarget[1];
    // }
    selectedChatPerson=para;
    selectedTarget = arrTarget[0] + '-' + arrTarget[1];
    $scope.ons.navigator.pushPage('conversacion.html', {
      animation: "slide"
    });
  };
});
app.controller("FavoritosController", function($scope, $http) {
  $scope.lanzarConversacionFavoritos=function(para){

    var arrTarget = [$scope.user2, para];
    arrTarget.sort();
    arrTarget.reverse();
    // selectedChatPerson=arrTarget[0];
    // if(selectedTarget==$scope.user2){
    //   selectedChatPerson=arrTarget[1];
    // }
    selectedChatPerson=para;

    selectedTarget = arrTarget[0] + '-' + arrTarget[1];
    $scope.ons.navigator.pushPage('conversacion.html', {
      animation: "slide"
    });
  };
});
app.controller("ConversacionController", function($scope, $http) {
  $scope.selectedTarget=selectedChatPerson;
  conn.send(JSON.stringify({
    "type": "getConver",
    "chatTarget": selectedTarget
  }));
  $scope.sendMessage=function(){

    conn.send(JSON.stringify({
      "message": '' + $('#textNuevo').val(),
      "chatTarget": selectedTarget,
      "from": $scope.user2,
      "to": selectedConversacion.nombre,
      "time": d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds(),
      "date": d.getFullYear() + '-' + monthNum[d.getMonth()] + '-' + d.getDate(),
      "type": "send"
    }));
    $('#textNuevo').val("");
  };
});
