// playground is a sandbox for ui elements and testing feasibility of new features...
// this file contains controllers, services, etc relating to playground features

// TODO break playground controller out to sub controllers,
// and define in same space as partial for simplicity

function createDataGrid($scope, $http, dataUrl) {

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };

    $scope.pagingOptions = {
        pageSizes: [10, 25, 100],
        pageSize: 10,
        totalServerItems: 15,
        currentPage: 1
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(
            function () {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.get(dataUrl)
                        .success(
                        function (servicesJson) {
                            data = servicesJson.filter(function (item) {
                                return JSON.stringify(
                                        item)
                                    .toLowerCase()
                                    .indexOf(
                                        ft) != -1;
                            });
                            $scope.setPagingData(
                                data,
                                page,
                                pageSize);
                        });
                } else {
                    $http.get(dataUrl).success(

                        function (servicesJson) {
                            // window.alert(servicesJson);
                            $scope.setPagingData(
                                servicesJson, page,
                                pageSize);
                        });
                }
            }, 100);
    };

    $scope.setPagingData = function (data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.servicesData = pagedData;
        $scope.pagingOptions.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize,
        $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function () {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize,
            $scope.pagingOptions.currentPage,
            $scope.filterOptions.filterText);
    }, true);
    $scope.$watch('filterOptions', function () {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize,
            $scope.pagingOptions.currentPage,
            $scope.filterOptions.filterText);
    }, true);

    $scope.mySelections = [];

    $scope.serviceName = "";
    $scope.url = "";
}



var opciones = myApp.controller('OpcionesController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', function ($scope, $routeParams, $http, $rootScope, $location) {
        //{{row.entity[col.field]}}
        $scope.columnDefs1 = [{ field:"id", displayName: "", cellTemplate: '<div><a class="btn btn-primary" ng-click="masInformacion(row.entity[col.field])"><i class="glyphicon glyphicon-plus glyphicon-white"></i> Info</a></div>'},
                                   { field:"objeto", displayName: "Nombre del objeto"},
                                   { field:"estado", displayName: "Estado del objeto"},
                                   { field:"email", displayName: "Email de contácto del propietario"},
                                   { field:"telefono", displayName: "Teléfono de contácto del propietario"}];

        $scope.gridOptions = {
            canSelectRows: true,
            multiSelect: false,
            jqueryUITheme: true,
            displaySelectionCheckbox: false,
            data: 'servicesData',
            columnDefs: 'columnDefs1',
            selectedItems: $scope.mySelections,
            enablePaging: true,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions
        };
        
        $scope.patronTelefono = (function() {
            var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
            return {
                test: function(value) {
                    if( $scope.requireTel === false ) {
                        return true;
                    }
                    return regexp.test(value);
                }
            };
        })();

        // add service name to the scope...
        $scope.widgetName = $routeParams.widgetName;
        $scope.widgetUrl = "opciones/" + $routeParams.widgetName + ".html"
        // tree support
        $scope.deleteNode = function (data) {
            data.nodes = [];
        };
        $scope.addNode = function (data) {
            var post = data.nodes.length + 1;
            var newName = data.name + '-' + post;
            data.nodes.push({name: newName, nodes: []});
        };
        $scope.tree = [
            {name: "Node", nodes: []}
        ];

        createDataGrid($scope, $http, '/disponibles');

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        // date
        $scope.date2 = null;

        $scope.addChild = function () {
            $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29)
            });
        }

        $scope.remove = function (index) {
            $scope.events.splice(index, 1);
        }

        // alerts (angular ui)
        $scope.alertSet = [
            { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];

        $scope.addToAlertSet = function () {
            $scope.alertSet.push({msg: "Another alert!"});
        };

        $scope.closeTheAlert = function (index) {
            $scope.alertSet.splice(index, 1);
        };

        // angularstrap
        $scope.modal2 = {content: 'Hello Modal', saved: false};
        $scope.tooltip = {title: "Hello Tooltip<br />This is a multiline message!", checked: false};
        $scope.popover = {content: "Hello Popover<br />This is a multiline message!", saved: false};
        $scope.alerts = [
            {type: 'success', title: 'Hello!', content: 'This is a success msg.<br><br><pre>2 + 3 = {{ 2 + 3 }}</pre>'}
        ];
        $scope.addAlert = function (type) {
            $scope.alerts.push({type: type, title: 'Alert!', content: 'This is another alert...'});
        };
        $scope.button = {active: true};
        $scope.buttonSelect = {price: '89,99', currency: 'â‚¬'};
        $scope.checkbox = {left: false, middle: true, right: false};
        $scope.radio = {left: false, middle: true, right: false};
        $scope.radioValue = 'middle';
        $scope.typeahead = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
        $scope.datepicker = {dateStrap: '12/12/2012'};
        $scope.timepicker = {timeStrap: '05:30 PM'};

        $scope.prettyPrint = function () {
            window.prettyPrint && window.prettyPrint();
        }

        // ace (for more options see http://ace.c9.io/#nav=howto)
        $scope.aceIDEs =
        {'JSON': 'var hw = new function() {\n  console.log("Hello world!");\n}',
            'HTML': '<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Hello</h1>\n    <h2>World!</h2>\n  </body>\n</html>',
            'XML': '‹?xml version= “1.0”›\n<x key="value">\n  <y>\n   Hello World!\n  </y>\n</x>',
            'Java': 'package com.foo.Hello;\n\npublic class HelloWorld {\n\n  public static void main(String args[]) {\n    System.out.println("Hello World!");\n  }\n\n}',
            'Javascript': '[\n  {\n    "w1": "Hello"\n  },\n  {\n    "w2": "World"\n  }\n]',
            'Python': 'print("Hello, World!")'
        };

        $scope.loadAceJSExample = function (_editor) {
            _editor.setValue($scope.aceIDEs['Javascript']);
            _editor.getSession().setUseWorker(false);

        };

        $scope.aceJSExampleChanged = function (e, acee) {

            // TODO Not sure how JavaScript validation works.
            // Have an open Google Groups question on this
            //console.log("e: " + e + ", acee: " + acee);

        };
        $scope.loadAceHTMLExample = function (_editor) {
            _editor.setValue($scope.aceIDEs['HTML']);
            _editor.getSession().setUseWorker(false);
        };

        $scope.loadAceXMLExample = function (_editor) {
            _editor.setValue($scope.aceIDEs['XML']);
            _editor.getSession().setUseWorker(false);
        };

        $scope.loadAceJSONExample = function (_editor) {
            _editor.setValue($scope.aceIDEs['JSON']);
            _editor.getSession().setUseWorker(false);
        };

        $scope.loadAceJavaExample = function (_editor) {
            _editor.setValue($scope.aceIDEs['Java']);
            _editor.getSession().setUseWorker(false);
        };

        $scope.loadAcePythonExample = function (_editor) {
            _editor.setValue($scope.aceIDEs['Python']);
            _editor.getSession().setUseWorker(false);
        };

        $scope.codecOutput = "";
        $scope.codecError = false;

        // TODO this should all be moved to a service
        $scope.codecService = function (func, input, callback) {
            console.log(func + ": " + input);
            input = encodeURIComponent(input);
            var url = '/hello-world/rest/v1/codec/' + func + '/' + input;
            return $http({method: 'GET', url: url})
                .success(function (data, status, headers, config) {
                    callback(data, true);
                })
                .error(function (data, status, headers, config) {
                    //console.log("failed to retrieve data");
                    callback(data, false);
                });
        };

        $scope.encode = function (input) {
            $scope.codecService('encode', input, function (data, success) {
                    console.log(data);
                    $scope.codecOutput = data;
                    $scope.codecError = !success;
                }
            );
        }

        $scope.decode = function (input) {
            $scope.codecService('decode', input, function (data) {
                    console.log(data);
                    $scope.codecOutput = data;
                }
            );
        }

        // form validation and binding
        $scope.master = "";
        $scope.incorrecta = false;
        $scope.incompleto = false;
        $scope.Objincompleto = false;
        $scope.email = "";

        $scope.saveForm = function (usuario) {

            if($scope.usuario === undefined || $scope.usuario.genero === undefined || $scope.usuario.contrasena === undefined || $scope.usuario.repcontrasena === undefined || $scope.usuario.nombre === undefined || $scope.usuario.email === undefined || $scope.usuario.apellido === undefined )
            {
                console.log("Algo undefined");
                $scope.incompleto = true;
            }
            else
            {
                $scope.incompleto = false;
                if($scope.usuario.contrasena === $scope.usuario.repcontrasena)
                {
                    console.log("Contraseña igual");
                    $scope.incorrecta = false;
                    //llamada Ajax
                    $.ajax({
                                            type: "POST",
                                            url: "registro",
                                            contentType: "application/json",
                                            dataType:'json',
                                            data: JSON.stringify({ "nombre" : $scope.usuario.nombre, "apellido": $scope.usuario.apellido, "pwd" : $scope.usuario.contrasena, "email" : $scope.usuario.email, "genero" : $scope.usuario.genero}),
                                            success: function(data){
                                                    if(data.registro === "true"){
                                                      $("#registro").html("Registrarse");
                                                      //$(location).attr('href','/');
                                                      $('#regCorrecto').modal('show');
                                                  }
                                                    else 
                                                    {
                                                        if(data.registro === "error")
                                                        {
                                                            
                                                            $("#registro").html("Registrarse");
                                                        }
                                                        else
                                                        {
                                                            //Ha ocurrido un error
                                                            $("#registro").html("Registrarse");
                                                        }
                                                    
                                                    }
                                                },
                                            beforeSend:function()
                                            {
                                               $("#registro").html("Conectando...");
                                            },
                                            error: function(xhr, status, error) {
                                                console.log("Ha ocurrido un error al registrarse.");
                                                var err = eval("(" + xhr.responseText + ")");
                                                alert(err.Message);
                                            },
                                            async: true
                                        });
                    
                    $scope.master = usuario;
                }
                else
                {
                    console.log("Contraseña distinta");
                    $scope.incorrecta = true;
                }
            }
            
        }
        $scope.passwordIncorrecta = function () {
            return $scope.incorrecta;
        }
        $scope.algoIncompleto = function () {
            return $scope.incompleto;
        }
        $scope.redireccionar = function(){
            $(location).attr('href','/');
        }

        $scope.perfildeUsuario = function(){
            console.log($rootScope.authService.currentUser());
        }

        $scope.guardarObjeto = function(){
            console.log($scope.objeto.nombre);
            console.log($scope.objeto.latitud);
            if($scope.objeto === undefined || $scope.objeto.nombre === undefined || $scope.objeto.descripcion === undefined || $scope.objeto.latitud === undefined || $scope.objeto.longitud === undefined || $scope.objeto.estado === undefined || $scope.objeto.telefono === undefined || $scope.objeto.foto === undefined)
            {
                console.log("Algo undefined");
                $scope.Objincompleto = true;
            }
            else
            {
                $scope.Objincompleto = false;
                    //llamada Ajax
                    $.ajax({
                                            type: "POST",
                                            url: "anadirObjeto",
                                            contentType: "application/json",
                                            dataType:'json',
                                            data: JSON.stringify({ "propietario" : $rootScope.authService.currentUser(),"nombre" : $scope.objeto.nombre, "descripcion": $scope.objeto.descripcion, "latitud" : $scope.objeto.latitud, "longitud" : $scope.objeto.longitud, "estado" : $scope.objeto.estado, "telefono" : $scope.objeto.telefono, "foto" : $scope.objeto.foto}),
                                            success: function(data){
                                                    if(data.anadir === "true"){
                                                        $("#anadir").html("Guardar Objeto");
                                                        $('#anadirCorrecto').modal('show');
                                                        var currentValue = parseInt($("#numeroObjetos").text());
                                                        currentValue = currentValue + 1;
                                                        $("#numeroObjetos").text(currentValue);
                                                        angular.element('#aLimpiar').trigger('click');
                                                  }
                                                    else 
                                                    {
                                                        if(data.anadir === "error")
                                                        {
                                                            
                                                            $("#anadir").html("Guardar Objeto");
                                                        }
                                                        else
                                                        {
                                                            //Ha ocurrido un error
                                                            $("#anadir").html("Guardar Objeto");
                                                        }
                                                    
                                                    }
                                                },
                                            beforeSend:function()
                                            {
                                               $("#anadir").html("Conectando...");
                                            },
                                            error: function(xhr, status, error) {
                                                console.log("Ha ocurrido un error al registrarse.");
                                                var err = eval("(" + xhr.responseText + ")");
                                                alert(err.Message);
                                            }
                                        });
                    
                    $scope.master = usuario;
            }
        }
        $scope.onFileSelect = function($files) {
            $scope.fotoSubida = $files[0];
            console.log($scope.fotoSubida + " "+ $files[0]);
        }
        $scope.subirFoto = function(foto){
            console.log("Subiendo foto... ");
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", $scope.file);
            console.log($scope.file);

            $http.post("/subirFoto", fd, {
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
                }).then(function(){
                    $("#anadir").html("Guardar Objeto");
                    $('#anadirCorrecto').modal('show');
                    var currentValue = parseInt($("#numeroObjetos").text());
                    currentValue = currentValue + 1;
                    $("#numeroObjetos").text(currentValue);
                    angular.element('#aLimpiar').trigger('click');
                }, function(){
                    console.log("Ha ocurrido un error al subirFoto.");
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);
                });

        }
        $scope.objetoIncompleto = function () {
            return $scope.Objincompleto;
        }
        $scope.redireccionarMapa = function() {
            $('#anadirCorrecto').modal('hide');
        }
        $scope.actualizarGrid = function(){
            console.log("Actualizar");
            createDataGrid($scope, $http, '/disponibles');
        }
        $scope.logeado = function(){
            return $rootScope.authService.isLoggedIn();
        }
        $scope.masInformacion = function(item, donde){
            console.log("Mas informacion "+ item);
            if($rootScope.authService.isLoggedIn())
            {
                //Está logeado
                //
                $.ajax({
                                    type: "GET",
                                    url: "objeto",
                                    contentType: "text/html",
                                    dataType:'html',
                                    data: "item="+item,
                                    success: function(data){
                                          $("#vista").html(data);
                                    },
                                    beforeSend:function()
                                    {
                                        $(location).attr('href', '#/objetoMapa');
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al cargar los objetos del usuario");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    }
                        });

            }
            else
            {
                //Mostrar modal de error
                $('#necesarioLogin').modal('show');

            }
        }
        $scope.mostrarLogin = function(){
            $('#necesarioLogin').modal('hide');
            $('#loginModal').modal('show');
        }
        $scope.cerrarModalNecesario = function(){
            $('#necesarioLogin').modal('hide');
        }

    }])
    ;

