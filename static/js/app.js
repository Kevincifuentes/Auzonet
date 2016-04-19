'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('myApp',
    [   'myApp.filters',
        'myApp.directives', // custom directives
        'ngGrid', // angular grid
        'ui', // angular ui
        'ngSanitize', // for html-bind in ckeditor
        'ui.ace', // ace code editor
        'ui.bootstrap', // jquery ui bootstrap
        '$strap.directives', // angular strap
        '720kb.socialshare'
    ]);


var filters = angular.module('myApp.filters', []);
var directives = angular.module('myApp.directives', []);

// bootstrap angular
myApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.when('/', {
        templateUrl:'partials/home.html'
    });
    $routeProvider.when('/subirFoto',{
    	templateUrl: '/subirFoto'
    })
    $routeProvider.when('/contact', {
        templateUrl:'partials/contact.html'
    });
    $routeProvider.when('/mapa', {
        templateUrl:'partials/mapa.html',
        controller : 'OpcionesController'
    });
    $routeProvider.when('/objetoMapa', {
        templateUrl:'partials/mapa.html'
    });
    $routeProvider.when("/objetosDisp", {
        templateUrl:'partials/objetosDisp.html',
        controller : 'OpcionesController'
    });
    $routeProvider.when('/about', {
        templateUrl:'partials/about.html'
    });
    $routeProvider.when('/faq', {
        templateUrl:'partials/faq.html'
    });

    $routeProvider.when('/opciones/registro', {
        templateUrl:'opciones/registro.html',
        controller:'OpcionesController'
    });

    $routeProvider.when('/opciones/objeto', {
        templateUrl:'opciones/objeto.html',
        controller:'OpcionesController'
    });

    $routeProvider.when('/opciones/perfil', {
        templateUrl:'opciones/perfil',
        controller:'OpcionesController',
    });

    $routeProvider.when('/opciones/:widgetName', {
        templateUrl:'opciones/opciones.html',
        controller:'OpcionesController'
    });

    // by default, redirect to site root
    $routeProvider.otherwise({
        templateUrl:'404.html'
    });

}]);

// this is run after angular is instantiated and bootstrapped
myApp.run(function ($rootScope, $location, $http, $timeout, AuthService) {

    // *****
    // Initialize authentication
    // *****
    $rootScope.authService = AuthService;
    $rootScope.logeado = false;

    // text input for login/password (only)
    $rootScope.loginInput = 'kevin.cifuentes@opendeusto.es';
    $rootScope.passwordInput = 'kev';

    $rootScope.$watch('authService.authorized()', function () {

        // if never logged in, do nothing (otherwise bookmarks fail)
        if ($rootScope.authService.initialState()) {
            // we are public browsing
            return;
        }

        // instantiate and initialize an auth notification manager
        $rootScope.authNotifier = new NotificationManager($rootScope);

        // when user logs in, redirect to home
        if ($rootScope.authService.authorized() && !$rootScope.logeado) {
            console.log($rootScope.logeado);
            $location.path("/");
            $rootScope.authNotifier.notify('information', '¡Bienvenido ' + $rootScope.authService.currentUser() + "!");
            $rootScope.logeado = true;
        }

        // when user logs out, redirect to home
        if (!$rootScope.authService.authorized() && $rootScope.logeado) {
            console.log($rootScope.logeado);
            $location.path("/");
            $rootScope.authNotifier.notify('information', '¡Has sido desconectado correctamente!');
            $rootScope.logeado = false;
        }
    }, true);

});

myApp.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
      
        $scope.file = (e.srcElement || e.target).files[0];
        console.log("Subido: "+$scope.file);
      })
      
    }
    
  }
  
  
})