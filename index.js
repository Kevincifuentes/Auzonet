/**
* @author Supal Dubey
* http://roadtobe.com/supaldubey/
**/

var server = require('./server');	
var controller = require("./controller");
var urlResponseHandlers = require("./urlResponseHandlers");

var handle = {};
  
handle["/"] = urlResponseHandlers.index;
handle["/index"] = urlResponseHandlers.index;
handle["/partial"] = urlResponseHandlers.partial;
handle["/login"] = urlResponseHandlers.conectarse;
handle["/registro"] = urlResponseHandlers.registrarse;
handle["/perfil"] = urlResponseHandlers.perfil;
handle["/actualizar"] = urlResponseHandlers.actualizarPerfil;
handle["/actualizarObjeto"] = urlResponseHandlers.actualizarObjeto;
handle["/objetosUsuario"] = urlResponseHandlers.objetosUsuario;
handle["/objeto"] = urlResponseHandlers.objeto;
handle["/objetoEditar"] = urlResponseHandlers.objetoEdit;
handle["/eliminarObjeto"] = urlResponseHandlers.eliminarObjeto;
handle["/subirFoto"] = urlResponseHandlers.subirFoto;
handle["/anadirObjeto"] = urlResponseHandlers.anadirObjeto;
handle["/disponibles"] = urlResponseHandlers.disponibles;
handle["/recuperar"] = urlResponseHandlers.recuperarContrasena;

server.start(controller.dispatch, handle);

