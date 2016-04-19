'use strict';

myApp.factory('AuthService',
    function () {
        var currentUser = null;
        var authorized = false;
        var initialState = true;
        var admin = true;
        var incorrecto = false;
        var error = false;
        var introducir = false;
        var recuperado = false;
        var emailIncorrecto = false;
        return {
            initialState:function () {
                return initialState;
            },
            login:function (name, password) {
                        $.ajax({
                                    type: "POST",
                                    url: "login",
                                    contentType: "application/json",
                                    dataType:'json',
                                    data: JSON.stringify({ "name" : name, "pwd" : password }),
                                    success: function(data){
                                            console.log("estoy despues")
                                            console.log("aloha"+data);
                                            if(data.login === "true"){
                                                      //Si es correcto
                                              currentUser = name;
                                              authorized = true;
                                              incorrecto = false;
                                              initialState = false;
                                              error = false;
                                              $("#loginModal").modal("hide");
                                              console.log(data.numeroObjetos);
                                              $("#numeroObjetos").text(data.numeroObjetos);
                                        }
                                        else {
                                            if(data.login === "error")
                                            {   
                                                authorized = false;
                                                incorrecto = false;
                                                initialState = false;
                                                error = true;
                                            }
                                            else
                                            {
                                                //Si no es correcto
                                                authorized = false;
                                                incorrecto = true;
                                                initialState = false;
                                                error = false;
                                            }
                                            
                                        }
                                        $("#botonLogin").html("Conectarse");
                                        },
                                    beforeSend:function()
                                    {
                                        console.log("Estoy antes")
                                        $("#botonLogin").html("Cargando...");
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al realizar login.");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    },
                                    async: false
                                });
                
            },
            logout:function () {
                currentUser = null;
                authorized = false;
                $(location).attr('href','/');
            },
            isLoggedIn:function () {
                return authorized;
            },
            currentUser:function () {
                return currentUser;
            },
            authorized:function () {
                return authorized;
            },
            esAdmin:function(){
                return admin;
            },
            loginIncorrecto:function(){
                return incorrecto;
            },
            error:function(){
                return error;
            },
            perfilUsuario:function(){
                $.ajax({
                                    type: "GET",
                                    url: "perfil",
                                    contentType: "text/html",
                                    dataType:'html',
                                    data: "email="+currentUser,
                                    success: function(data){
                                        $('#vista').hide().html(data).fadeIn('slow');
                                          //$("#vista").html(data);
                                    },
                                    beforeSend:function()
                                    {
                                        
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al cargar el perfil");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    },
                                    async: false
                                });
                
            },
            objetosUsuario:function(){
                $.ajax({
                                    type: "GET",
                                    url: "objetosUsuario",
                                    contentType: "text/html",
                                    dataType:'html',
                                    data: "email="+currentUser,
                                    success: function(data){
                                          $('#vista').hide().html(data).fadeIn('slow');
                                    },
                                    beforeSend:function()
                                    {

                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al cargar los objetos del usuario");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    },
                                    async: false
                        });
                
            },
            recuperacion:function(){
                recuperado = false;
                console.log("recuperacion");
                $('#loginModal').modal('hide');
                $('#recuperar').modal('show');
            },
            recuperacionRealizada:function(){
                return recuperado;
            },
            introducirEmail:function(){
                return introducir;
            },
            recuperar:function(email){
                console.log(email);
                if(email === undefined || email === "")
                {
                    introducir = true;
                    emailIncorrecto = false;
                    error = false;
                }
                else
                {
                    introducir = false;
                    emailIncorrecto = false;
                    error = false;
                    $.ajax({
                                    type: "POST",
                                    url: "recuperar",
                                    contentType: "application/json",
                                    dataType:'json',
                                    data: JSON.stringify({ "email" : email}),
                                    success: function(data){
                                        $("#botonRecuperar").html("Recuperar contraseña");
                                        if(data.recuperacion === "true"){
                                            console.log("Correcto");
                                            recuperado = true;
                                        }
                                        else
                                        {
                                            if(data.recuperacion === "false")
                                            {
                                                console.log("Incorrecto");
                                                emailIncorrecto = true;
                                            }
                                            else
                                            {
                                                console.log("Error");
                                                error = true;
                                            }
                                        }
                                        $("#recContra").trigger("keypress");
                                    },
                                    beforeSend:function()
                                    {
                                        $("#botonRecuperar").html("Cargando...");
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al cargar los objetos del usuario");
                                        error = true;
                                        $("#botonRecuperar").html("Recuperar contraseña");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    },
                                    async : false
                        });
                }
            },
            recuperarIncorrecto:function(){
                return emailIncorrecto;
            }

        };
    }
);