var http = require('http'),
    fs = require('fs'),
    util = require('util'),
    nodemailer = require('nodemailer'),
    formidable = require("formidable"),
    mongo = require('mongodb'),
    ejs = require('ejs'),
    qs = require('querystring'),
	url = require("url");

var numeroObjetos, numeroUsuarios, cuantos;
var objetoAEditar;
var primeraVez = true;
function index(res) {
	console.log("SE HA LLAMADO A INDEX");
	fs.readFile('./static/index.html', function (err, html) {
    if (err) {
        throw err; 
    }
    res.writeHead(200, {"Content-Type": "text/html"});  
    res.write(html);
    res.end();
    var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          db.collection('objetos').count(function(error, objetos) {
                    // Do what you need the count for here.
                    numeroObjetos = objetos;
                });
          db.collection('usuarios').count(function(error, usuarios) {
                    numeroUsuarios = usuarios;
                });
                primeraVez = false;
        });
    });
}

function partial(res, req, filename) {
	console.log("SE HA LLAMADO AL PARTIAL");
	s.readFile(filename, function (err, html) {
    if (err) {
        throw err; 
    }
    res.writeHead(200, {"Content-Type": "text/html"});  
    res.write(html);
    res.end();
    });
}

function conectarse(res, req, filename)
{
	console.log("SE HA INTENTADO LOGIN");
	//util.log(util.inspect(req));
	//util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
	var body = "";
	req.on('data', function (chunk) {
    		body += chunk;
  		});
  	req.on('end', function () {
    	console.log('body: ' + body);
    	var jsonObj = JSON.parse(body);
  		console.log(jsonObj.pwd);
  		//BUSQUEDA EN LA BD DEL NOMBRE DE USUARIO *****
      console.log("Empezando consulta...");
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err){
            console.log("LOGIN CON ERROR");
            res.writeHead(200, {"Content-Type": "text/json"});  
            res.write(JSON.stringify({ "login" : "error"}));
            res.end();
          }
          console.log("Conexión establecida...");
          var collection = db.collection('usuarios');
          collection.find({"email":jsonObj.name}).limit(1).toArray(function(err, results)
            {
              if(err)
              {
                console.log("Error en DB");
                console.log("LOGIN CON ERROR");
                res.writeHead(200, {"Content-Type": "text/json"});  
                res.write(JSON.stringify({ "login" : "error"}));
                res.end();
                db.close();
              }
              results.forEach(function (doc) {
                  if(jsonObj.pwd === doc.contraseña)
                  {
                    db.collection('objetos').find({ propietario : doc._id}).count(function(error, objetos) {
                      if(error){console.log(error)}
                      console.log("LOGIN CORRECTO: "+ objetos);
                      res.writeHead(200, {"Content-Type": "text/json"});  
                      res.write(JSON.stringify({ "login" : "true", "numeroObjetos" : objetos}));
                      res.end();
                      db.close();
                    });
                  }
                  else
                  {
                    console.log("LOGIN INCORRECTO");
                    res.writeHead(200, {"Content-Type": "text/json"});  
                    res.write(JSON.stringify({ "login" : "false"}));
                    res.end();
                    db.close();
                  }
                });
              if(results.length == 0)
              {
                console.log("LOGIN INCORRECTO");
                res.writeHead(200, {"Content-Type": "text/json"});  
                res.write(JSON.stringify({ "login" : "false"}));
                res.end();
                db.close();
              }
            });
        });
      //******
  })
}

function registrarse(res, req, filename)
{
  console.log("SE HA LLAMADO REGISTRO");
  var body = "";
  req.on('data', function (chunk) {
        body += chunk;
      });
    req.on('end', function () {
      console.log('body: ' + body);
      var jsonObj = JSON.parse(body);
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err){
            console.log("Registro CON ERROR");
            res.writeHead(200, {"Content-Type": "text/json"});  
            res.write(JSON.stringify({ "login" : "error"}));
            res.end();
            db.close();
          }
          console.log("Conexión establecida...");
          
          var numeroUsuarios = parseInt(db.collection('usuarios').count());
          var numeroObjetos = parseInt(db.collection('objetos').count());
          console.log("HAY "+ numeroUsuarios + " usuarios registrados y "+ numeroObjetos+ " objetos");
          numeroObjetos = numeroObjetos+1;
          numeroUsuarios = numeroUsuarios+1;
          console.log(numeroObjetos + " "+ numeroUsuarios);
          db.collection('usuarios').insert( {
                _id : numeroUsuarios,
                "nombre" : jsonObj.nombre,
                "apellido" : jsonObj.apellido,
                "email" : jsonObj.email,
                "contraseña" : jsonObj.pwd,
                "genero" : jsonObj.genero,
                "objetos": [numeroObjetos]
             }, function(err, result) {
              if(err)
              {
                console.log("Registro INCORRECTO");
                console.log(err)
                res.writeHead(200, {"Content-Type": "text/json"});  
                res.write(JSON.stringify({ "registro" : "false"}));
                res.end();
                db.close();
              }
              else
              {
                  console.log("Se ha insertado correctamente el nuevo usuario");
                  console.log("Añado objeto de prueba");
                  db.collection('objetos').insert({ _id : numeroObjetos, "propietario" : numeroUsuarios, "objeto" : "prueba", "descripcion" : "prueba de objeto", "localizacion" : { "latitud" : 0.0, "longitud" : 0.0}, "estado" : "nuevo", "telefono" : 666666666, "email" : jsonObj.email});
                  console.log("¡Añadido!")
                  res.writeHead(200, {"Content-Type": "text/json"});  
                  res.write(JSON.stringify({ "registro" : "true"}));
                  res.end();
                  db.close();
                  var transporter = nodemailer.createTransport({
                      service: 'Mail.ru',
                      auth: {
                          user: 'auzonet@mail.ru',
                          pass: 'deusto123'
                      }
                  });
                  var mailOptions = {
                      from: 'Auzonet ✔ <auzonet@mail.ru>', // sender address
                      to: jsonObj.email, // list of receivers
                      subject: '¡Bienvenido a Auzonet! ✔', // Subject line
                      text: '¡Bienvenido '+jsonObj.nombre+' a Auzonet!', // plaintext body
                      html: '<div><b>¡Bienvenido a Auzonet '+jsonObj.nombre+'!</b><br><p>Te damos la bienvenida a la página web de nuestro barrio, en la que podrás compartir todas las cosas que ya no utilizas con personas que las necesitan.<br>De misma manera, si tu necesitas cualquier cosa, no dudes en mirar en la web y preguntar por ella.<br> Esperamos que te sea de gran ayuda.<br><br>Un saludo,<br>El equipo de Auzonet<br>auzonet@mail.ru</p></div>' // html body
                  };
                    transporter.sendMail(mailOptions, function(error, info){
                      if(error){
                          return console.log(error); 
                      }
                      console.log('Mensaje enviado: ' + info.response);

                    });
                }
              });


            });
      });
}

function perfil(res, req, filename)
{
  console.log("SE HA LLAMADO PERFIL");
  var body = "";
  req.on('data', function (chunk) {
        body += chunk;
      });
  req.on('end', function () {
      console.log('body: ' + body);
      var str = req.url.split('?')[1];
      str = qs.parse(str);
      console.log("EL NOMBRE ES "+ str.email);
      console.log("Empezando consulta...");
      var nombre, apellido, contrasena, genero;
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err){
            console.log("PERFIL CON ERROR");
            res.writeHead(200, {"Content-Type": "text/json"});  
            res.write(JSON.stringify({ "perfil" : "error"}));
            res.end();
          }
          console.log("Conexión establecida...");
          var collection = db.collection('usuarios');
          collection.find({"email":str.email}).limit(1).toArray(function(err, results)
            {
              results.forEach(function (doc) {
                nombre = doc.nombre;
                apellido = doc.apellido;
                contrasena = doc.contraseña;
                genero = doc.genero;
              });
              db.close();
              console.log(nombre + " : "+ apellido + " : " + contrasena + " : "+ genero);
              res.writeHead(200, {"Content-Type": "text/html"});
              ejs.renderFile(__dirname +'/static/ejs/perfil.ejs', {"email": str.email, "nombre": nombre , "apellido" : apellido, "contrasena" : contrasena, "genero" : genero}, function(err, html){
                  if (err) return err;
                  res.write(html);
                  console.log("Acabo");
                  res.end();
              });
            });
        });
    });
  
}

function actualizarPerfil(res, req, filename)
{
    console.log("SE HA LLAMADO A actualizarPerfil");
    var body = "";
    req.on('data', function (chunk) {
          body += chunk;
        });
    req.on('end', function () {
      console.log('body: ' + body);
      var jsonObj = JSON.parse(body);
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err)
          {
            console.log("ACTUALIZACION CON ERROR");
            res.writeHead(200, {"Content-Type": "text/json"});  
            res.write(JSON.stringify({ "actualizacion" : "false"}));
            res.end();
            db.close();
          }
          else
          {
            var collection = db.collection('usuarios');
            collection.update({"email":jsonObj.email}, {$set: {"nombre" : jsonObj.nombre, "apellido" : jsonObj.apellido, "contraseña" : jsonObj.contrasena}});
            console.log("Actualización correcta.");
            res.writeHead(200, {"Content-Type": "text/json"});  
            res.write(JSON.stringify({ "actualizacion" : "true"}));
            res.end();
            db.close();
          }
          
        });
    });
}

function objetosUsuario(res, req, filename)
{
  console.log("SE HA LLAMADO A objetosUsuario");
  var body = "";
  req.on('data', function (chunk) {
        body += chunk;
      });
  req.on('end', function () {
      console.log('body: ' + body);
      var str = req.url.split('?')[1];
      str = qs.parse(str);
      console.log("EL NOMBRE ES "+ str.email);
      console.log("Empezando consulta...");
      var idUsuario, email;
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err){
            console.log("OBJETOS CON ERROR");
            res.writeHead(404, {"Content-Type": "text/html"});  
            res.write(JSON.stringify({ "objetos" : "error"}));
            res.end();
          }
          console.log("Conexión establecida...");
          var collection = db.collection('usuarios');
          collection.find({"email":str.email}).limit(1).toArray(function(err, results)
            {
              if(err) {
              	console.log("ERROR al encontrar usuario");
	            res.writeHead(404, {"Content-Type": "text/html"});  
	            res.write(JSON.stringify({ "objetos" : "error"}));
	            res.end();
              db.close();
              }
              results.forEach(function (doc) {
                idUsuario = doc._id;
                email = doc.email;
              });
              console.log("Indentificador de Usuario: "+ idUsuario);
              var objetos = db.collection('objetos');
              objetos.find({"propietario" : idUsuario}).toArray(function(err, resultados)
              {
              	res.writeHead(200, {"Content-Type": "text/html"});
              	console.log("Empiezo renderFile");
	            ejs.renderFile(__dirname +'/static/ejs/objetos.ejs', {"email" : email, "objetos": resultados}, function(err, html){
	                if (err) return err;
	                res.write(html);
	                console.log("Acabo");
	                res.end();
                  db.close();
	            });
              });
            });
        });
    });
}

function eliminarObjeto(res, req, filename)
{
  console.log("Se ha llamado a eliminarObjeto");
  var body = "";
  var propietario;
  req.on('data', function (chunk) {
        body += chunk;
      });
  req.on('end', function () {
    console.log("Empezando consulta...");
        var jsonObj = JSON.parse(body);
        var MongoClient = mongo.MongoClient;
        MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
          {
            if(err){
              console.log("ELIMINAR OBJETO CON ERROR");
              res.writeHead(200, {"Content-Type": "text/json"});  
              res.write(JSON.stringify({ "eliminado" : "error"}));
              res.end();
            }
            console.log("Conexión establecida...");
            var coleccion = db.collection('objetos');
            coleccion.find({_id : jsonObj.objeto}).toArray(function(err, results)
            {
              results.forEach(function (doc) {
                propietario = doc.propietario;
              });
              console.log("El propietario es: "+ propietario);
              coleccion.deleteOne({_id : jsonObj.objeto}, function(err, results)
              {
                  if(err){
                    console.log("ERROR al eliminar objeto");
                    res.writeHead(200, {"Content-Type": "text/json"});  
                    res.write(JSON.stringify({ "eliminado" : "error"}));
                    res.end();
                    db.close();
                  }
                  numeroObjetos = numeroObjetos - 1;
                  console.log("Actualizando usuario "+ propietario+" del objeto "+ jsonObj.objeto);
                  var collection = db.collection('usuarios');
                  collection.update({ _id: propietario },{ $pull: { 'objetos': { $in: [jsonObj.objeto] } } });
                  console.log("Actualización correcta.");
                  res.writeHead(200, {"Content-Type": "text/json"});  
                  res.write(JSON.stringify({ "eliminado" : "true"}));
                  res.end();
                  db.close();
              });
            });
          });
  });
}

function anadirObjeto(res, req, filename)
{
  console.log("Se ha llamado a anadirObjeto");
  var body = "";
  var propietario;
  req.on('data', function (chunk) {
        body += chunk;
      });
  req.on('end', function () {
    var jsonObj = JSON.parse(body);
    console.log(jsonObj.propietario+" "+jsonObj.nombre);
    console.log("Empezando consulta...");
    var MongoClient = mongo.MongoClient;
    MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
      {
        if(err){
              console.log("AÑADIR OBJETO CON ERROR");
              res.writeHead(200, {"Content-Type": "text/json"});  
              res.write(JSON.stringify({ "anadir" : "error"}));
              res.end();
        }
        db.collection('objetos').count(function(error, objetos) {
                    // Do what you need the count for here.
                    numeroObjetos = objetos;
                    numeroObjetos = numeroObjetos + 1;
                    console.log("Cuantos: "+ numeroObjetos);
                    var collection = db.collection('usuarios');
                    collection.find({"email":jsonObj.propietario}).limit(1).toArray(function(err, results)
                    {
                      if(err) {
                          console.log("ERROR al encontrar usuario");
                          res.writeHead(200, {"Content-Type": "text/json"});  
                          res.write(JSON.stringify({ "anadir" : "error"}));
                          res.end();
                          db.close();
                      }
                      results.forEach(function (doc) {
                            propietario = doc._id;
                      });
                      db.collection('objetos').insert({ _id : numeroObjetos, "propietario" : propietario, "objeto" : jsonObj.nombre, "descripcion" : jsonObj.descripcion, "localizacion" : { "latitud" : jsonObj.latitud, "longitud" : jsonObj.longitud}, "estado" :  jsonObj.estado, "telefono" :  jsonObj.telefono, "email" : jsonObj.propietario, "foto" : jsonObj.foto});
                      db.collection('usuarios').update({ _id: propietario },{ $push: { 'objetos': numeroObjetos } } );
                      console.log("Actualización correcta.");
                      res.writeHead(200, {"Content-Type": "text/json"});  
                      res.write(JSON.stringify({ "anadir" : "true"}));
                      res.end();
                      db.close();
        });
        });
        
      });

  });
}

function subirFoto(res,req,filename)
{
  req.on('end', function () {
    console.log("Se ha llamado a subirFoto");
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //el process.cwd: current working directory
    form.uploadDir = process.cwd();
    console.log("about to parse");
    //Coje los datos de la petición entrante y los procesa dando lugar a una colección de campos de entrada del formulario y una colección de fichero enviados
    form.parse(req, function(error, fields, files) {
      console.log("parsing done");
      console.log(fields + " "+ files);
      /* Possible error on Windows systems:
         tried to rename to an already existing file */
      var tiempo = new Date().getTime();
      fs.rename(files.upload.path, "/imagenes/objetos/"+tiempo+"_"+numeroObjetos+".png", function(err) {
        if (err) {
          //elimino
          console.log("Hay error " + err);
          fs.unlink("/imagenes/objetos/"+tiempo+"_"+numeroObjetos+".png");
          fs.rename(files.upload.path, "/imagenes/objetos/"+tiempo+"_"+numeroObjetos+".png");
        }
      });
      response.writeHead(200, {"Content-Type": "text/json"});
      response.write(JSON.stringify({ "foto" : "true"}));
      response.end();
    //response.end(util.inspect({fields: fields, files: files}));
    });
  });
}

function disponibles(res, req, filename)
{
  console.log("Se ha llamado a Obtener objetos disponibles");
  var MongoClient = mongo.MongoClient;
    MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
      {
        if(err){
              console.log("DISPONIBLES CON ERROR");
              res.writeHead(200, {"Content-Type": "text/json"});  
              res.write(JSON.stringify({ "objetos" : "error"}));
              res.end();
        }
        var collection = db.collection('objetos');
        collection.find().toArray(function(err, results)
            {
              if(err) {
                console.log("ERROR al obtener objetos");
              res.writeHead(200, {"Content-Type": "text/json"});  
              res.write(JSON.stringify({ "objetos" : "error"}));
              res.end();
              db.close();
              }
             // var respuesta = JSON.stringify("[");
              var cuantos = results.length;
              console.log("Cuantos hay: "+ cuantos);
              var contador = 1;
              results.forEach(function (doc) {
                console.log(contador);
                if(contador == cuantos)
                {
                 // respuesta = respuesta + JSON.stringify({ "id" : doc._id, "propietario" : doc.propietario, "objeto" : doc.objeto, "descripcion" : doc.descripcion, "localizacion" : { "latitud" : doc.localizacion.latitud, "longitud" : doc.localizacion.longitud}, "estado" : doc.estado, "telefono" : doc.telefono}]);

                }
                else
                {
                //  respuesta = respuesta + JSON.stringify({ "id" : doc._id, "propietario" : doc.propietario, "objeto" : doc.objeto, "descripcion" : doc.descripcion, "localizacion" : { "latitud" : doc.localizacion.latitud, "longitud" : doc.localizacion.longitud}, "estado" : doc.estado, "telefono" : doc.telefono});

                }
                contador++;
              });
              console.log("------Resultado-------");
              //console.log(respuesta);
              res.writeHead(200, {"Content-Type": "text/json"});  
              //res.write(JSON.stringify(respuesta));
              res.write(JSON.stringify(results.map(function (doc){ return { "id" : doc._id, "propietario" : doc.propietario, "objeto" : doc.objeto, "descripcion" : doc.descripcion, "estado" : doc.estado, "telefono" : doc.telefono, "localizacion" : { "latitud" : doc.localizacion.latitud, "longitud" : doc.localizacion.longitud},"email" : doc.email }})));
              res.end();
              db.close();
            });

      });

}

function recuperarContrasena(res, req, filename)
{
  console.log("Se ha llamado a recuperarContrasena");
  var body = "";
  var contrasena;
  req.on('data', function (chunk) {
        body += chunk;
      });
    req.on('end', function () {
      console.log('body: ' + body);
      var jsonObj = JSON.parse(body);
      console.log("Email: "+ jsonObj.email);
      var MongoClient = mongo.MongoClient;
        MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
          {
            if(err){
                  console.log("Recuperar contraseña con ERROR");
                  res.writeHead(200, {"Content-Type": "text/json"});  
                  res.write(JSON.stringify({ "recuperacion" : "error"}));
                  res.end();
            }
            var collection = db.collection('usuarios');
            collection.find({"email":jsonObj.email}).limit(1).toArray(function(err, results)
            {
              if(err) {
                    console.log("Recuperar contraseña con ERROR");
                  res.writeHead(200, {"Content-Type": "text/json"});  
                  res.write(JSON.stringify({ "recuperacion" : "error"}));
                  res.end();
                  db.close();
                }
                results.forEach(function (doc) {
                  contrasena = doc.contraseña;
                });
                db.close();
                if(contrasena === undefined)
                {
                  res.writeHead(200, {"Content-Type": "text/json"});  
                  res.write(JSON.stringify({ "recuperacion" : "false"}));
                  res.end();
                }
                else
                {
                  res.writeHead(200, {"Content-Type": "text/json"});  
                  res.write(JSON.stringify({ "recuperacion" : "true"}));
                  res.end();

                  var transporter = nodemailer.createTransport({
                      service: 'Mail.ru',
                      auth: {
                          user: 'auzonet@mail.ru',
                          pass: 'deusto123'
                      }
                  });
                  var mailOptions = {
                      from: 'Auzonet ✔ <auzonet@mail.ru>', // sender address
                      to: jsonObj.email, // list of receivers
                      subject: 'Recuperación de la contraseña ✔', // Subject line
                      text: 'Recuperación  de la contraseña', // plaintext body
                      html: '<div><b>Se ha solicitado la recuperación de la contraseña de la cuenta de '+jsonObj.email+'.</b><br><p>Te recomendamos que guardes la contraseña en un lugar seguro o que utilices una contraseña fácil de recordar. La contraseña de la cuenta es:<br>✔ Contraseña: '+contrasena+'<br> Esperamos que puedas conectarte ahora sin problema. Te recomendamos que cambies tu contraseña desde el perfil de usuario de tu cuenta.<br><br>Un saludo,<br>El equipo de Auzonet<br>auzonet@mail.ru</p></div>' // html body
                  };
                    transporter.sendMail(mailOptions, function(error, info){
                      if(error){
                          return console.log(error); 
                      }
                      console.log('Mensaje enviado: ' + info.response);

                    });
                }
            });
          });
      });
}

function objeto(res, req, filename)
{
    console.log("Se ha llamado a objeto");

    var body = "";
  req.on('data', function (chunk) {
        body += chunk;
      });
  req.on('end', function () {
      console.log('body: ' + body);
      var str = req.url.split('?')[1];
      str = qs.parse(str);
      console.log("EL ITEM ES "+ str.item);
      console.log("Empezando consulta...");
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err){
            console.log("OBJETO CON ERROR");
            res.writeHead(404, {"Content-Type": "text/html"});  
            res.write(JSON.stringify({ "objetos" : "error"}));
            res.end();
          }
          console.log("Conexión establecida...");
          var collection = db.collection('objetos');
          collection.find({ _id : Number(str.item)}).toArray(function(err, results)
            {
              if(err) {
                console.log("ERROR al encontrar OBJETO");
                res.writeHead(404, {"Content-Type": "text/html"});  
                res.write(JSON.stringify({ "objetos" : "error"}));
                res.end();
                db.close();
              }
              console.log(results);
              results.forEach(function (doc) {
                console.log("ForEach");
                res.writeHead(200, {"Content-Type": "text/html"});
                console.log("Empiezo renderFile");
                ejs.renderFile(__dirname +'/static/ejs/objeto.ejs', {"objeto": doc}, function(err, html){
                  if (err) return err;
                  res.write(html);
                  console.log("Acabo");
                  res.end();
                  db.close();
              });
              });

            });
        });
    });
}

function objetoEdit(res, req, filename)
{
  console.log("Se ha llamado a objetoEdit");
  var body = "";
  req.on('data', function (chunk) {
        body += chunk;
      });
  req.on('end', function () {
      console.log('body: ' + body);
      var str = req.url.split('?')[1];
      str = qs.parse(str);
      console.log("EL ITEM ES "+ str.item);
      console.log("Empezando consulta...");
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err){
            console.log("Enviar Editar CON ERROR");
            res.writeHead(404, {"Content-Type": "text/html"});  
            res.write(JSON.stringify({ "objetos" : "error"}));
            res.end();
          }
          console.log("Conexión establecida...");
          var collection = db.collection('objetos');
          objetoAEditar = Number(str.item);
          collection.find({ _id : Number(str.item)}).toArray(function(err, results)
            {
              if(err) {
                console.log("Enviar Editar CON ERROR");
                res.writeHead(404, {"Content-Type": "text/html"});  
                res.write(JSON.stringify({ "objetos" : "error"}));
                res.end();
                db.close();
              }
              console.log(results);
              results.forEach(function (doc) {
                console.log("ForEach");
                res.writeHead(200, {"Content-Type": "text/html"});
                console.log("Empiezo renderFile");
                ejs.renderFile(__dirname +'/static/ejs/editarObjeto.ejs', {"objeto": doc}, function(err, html){
                  if (err) return err;
                  res.write(html);
                  console.log("Acabo");
                  res.end();
                  db.close();
              });
              });

            });
        });
    });
}

function actualizarObjeto(res, req, filename)
{
  console.log("Se ha llamado a actualizarObjeto");
    var body = "";
    req.on('data', function (chunk) {
          body += chunk;
        });
    req.on('end', function () {
      console.log('body: ' + body);
      var jsonObj = JSON.parse(body);
      var MongoClient = mongo.MongoClient;
      MongoClient.connect("mongodb://localhost:27017/Proyecto", function(err, db)
        {
          if(err)
          {
            console.log("ACTUALIZACION DE OBJETO CON ERROR");
            res.writeHead(200, {"Content-Type": "text/json"});  
            res.write(JSON.stringify({ "actualizacion" : "false"}));
            res.end();
            db.close();
          }
          else
          {
            var collection = db.collection('objetos');
            collection.update({"_id":Number(jsonObj._id)}, {$set: {"objeto" : jsonObj.nombre, "descripcion" : jsonObj.descripcion, "estado" : jsonObj.estado, "telefono" : jsonObj.telefono, "localizacion" : { "latitud" : jsonObj.latitud, "longitud" : jsonObj.longitud}}});
            console.log("Actualización de Objeto correcta.");
            res.writeHead(200, {"Content-Type": "text/json"});  
            res.write(JSON.stringify({ "actualizacion" : "true"}));
            res.end();
            db.close();
          }
          
        });
    });
}


exports.perfil = perfil;
exports.subirFoto = subirFoto;
exports.recuperarContrasena = recuperarContrasena;
exports.disponibles = disponibles;
exports.objetoEdit = objetoEdit;
exports.anadirObjeto = anadirObjeto;
exports.eliminarObjeto = eliminarObjeto;
exports.objetosUsuario = objetosUsuario;
exports.objeto = objeto;
exports.actualizarPerfil = actualizarPerfil;
exports.actualizarObjeto = actualizarObjeto;
exports.index = index;
exports.partial = partial;
exports.registrarse = registrarse;
exports.conectarse = conectarse;