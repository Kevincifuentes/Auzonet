/**
* @author Supal Dubey
* http://roadtobe.com/supaldubey/
**/

var path = require('path'),
    fs = require('fs');
	
function handleStatic(pageUrl, response)
{
	console.log("Empiezo a leer "+pageUrl);
	//se crea la ruta absoluta del fichero
	var filename = path.join(process.cwd()+'/static/', pageUrl);
	//mira a ver si existe el fichero en esa ruta
	fs.exists(filename, function(exists) {
		if(!exists) {
			console.log("No existe: " + filename);
			response.writeHead(200, {'Content-Type': 'text/html'});
			var error = path.join(process.cwd()+'/static/', "404.html");
			var fileStream = fs.createReadStream(error);
			fileStream.on('end', function() {
			response.end();
			});
			fileStream.pipe(response);
			return;
		}
		//Do not send Content type, browser will pick it up.
		response.writeHead(200);

		console.log("Empiezo a leer "+pageUrl);
		var fileStream = fs.createReadStream(filename);
		fileStream.on('end', function() {
			response.end();
		});
		//envia fragmentos hasta acabar, cuando entonces llama al anterior on.('end') a ejecutar.
		fileStream.pipe(response);
		return;
	}); 		
}
exports.handleStatic = handleStatic;		