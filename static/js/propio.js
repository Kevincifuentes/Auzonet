
function actualizarUsuario()
{
	console.log("actualizando usuario...");
	console.log();
	var nombre = document.getElementById('nombre');
	var contrasena = document.getElementById('contrasena');
	var email = document.getElementById('email');
	var apellido = document.getElementById('apellido');
	if(nombre === "" || contrasena === "" || apellido === "")
	{
		alert("Error: Es necesario que todos los campos esten rellenados.");
	}
	else
	{
		$.ajax({
                                    type: "POST",
                                    url: "actualizar",
                                    contentType: "application/json",
                                    dataType:'json',
                                    data: JSON.stringify({ "nombre" : nombre.value, "contrasena" : contrasena.value, "email" : email.value, "apellido" : apellido.value }),
                                    success: function(data){
                                            if(data.actualizacion === "true"){
                                              //Actualización correcta (redireccionar a index)
                                              $('#actualizacionOK').modal('show');
                                              $("#botonActualizar").html("Actualizar perfil");
                                        }
                                        else {
                                            if(data.actualizacion === "error")
                                            {   
                                                //ERROR
												                        $('#actualizacionERROR').modal('show');
                                                $("#botonActualizar").html("Actualizar perfil");
                                            }
                                        }
                                        },
                                    beforeSend:function()
                                    {
                                        $("#botonActualizar").html("Actualizando...");
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al actualizar el perfil.");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    },
                                    async: false
                                });
	}
}

function eliminarObjeto(numero,nombre)
{
    console.log("El objeto a eliminar tiene el identificador: "+ numero);
    if(confirm("¿Está seguro de que desea eliminar el objeto "+ nombre+" ?"))
    {
        $.ajax({
                                    type: "POST",
                                    url: "eliminarObjeto",
                                    contentType: "application/json",
                                    dataType:'json',
                                    data: JSON.stringify({ "objeto" : numero}),
                                    success: function(data){
                                            if(data.eliminado === "true"){
                                              //Actualización correcta (redireccionar a index)
                                             /* var parent = document.getElementById("container");
                                              var child = document.getElementById("p1");
                                              parent.removeChild(child);*/
                                              $('#eliminado').modal('show');
                                              $('#'+numero).slideUp("normal", function() { $(this).remove(); } );
                                              var currentValue = parseInt($("#numeroObjetos").text());
                                              currentValue = currentValue - 1;
                                              $("#numeroObjetos").text(currentValue);
                                              $("#btneliminar").html("Eliminar");
                                        }
                                        else {
                                            if(data.eliminado === "error")
                                            {   
                                                //ERROR
                                                $('#eliminarERROR').modal('show');
                                                $("#btneliminar").html("Eliminar");
                                            }
                                        }
                                        $("#btneliminar").html("Eliminar");
                                        },
                                    beforeSend:function()
                                    {
                                       $("#btneliminar").html("Espere..."); 
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al eliminar el objeto");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    }
                                });
    }
}

function cargarObjetosMapa(map)
{
  $.ajax({
                                    type: "GET",
                                    url: "disponibles",
                                    contentType: "text/json",
                                    dataType:'json',
                                    success: function(data){
                                          console.log(data[0]);
                                          $.each(data, function(i, item) {
                                              console.log(data[i].objeto);
                                              var objeto = L.icon({
                                                iconUrl: 'imagenes/objeto.png',
                                                iconSize:     [25, 41]
                                              });

                                              var marcador = L.marker([Number(data[i].localizacion.latitud), Number(data[i].localizacion.longitud)], {icon: objeto});
                                              marcador.bindPopup("<div ng-controller='OpcionesController'><p><b>Nombre del objeto: </b>"+data[i].objeto+"<br><b>Estado: </b>"+data[i].estado+"<br><b>Propietario: </b>"+data[i].email+"<br><a class='btn btn-large btn-primary' onclick='masInformacion("+data[i].id+")'>Más información...</a></p></div>");
                                              marcador.addTo(map);
                                          });
                                    },
                                    beforeSend:function()
                                    {

                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al cargar los objetos del usuario");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    },
                                    async: true
                                });

}

function masInformacion(item)
{
  angular.element($("#mapaObjetos")).scope().masInformacion(item);
}

function editar(item)
{
  console.log("Editar");
  $.ajax({
                                    type: "GET",
                                    url: "objetoEditar",
                                    contentType: "text/html",
                                    dataType:'html',
                                    data: "item="+item,
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
                                    }
                        });
}

function actualizarObjeto(item)
{
  console.log("actualizando objeto...");
  console.log();
  var nombre = document.getElementById('nombreObjeto');
  var descripcion = document.getElementById('descripcion');
  var estado = document.getElementById('estado');
  var telefono = document.getElementById('telefono');
  var latitud = document.getElementById('latitud');
  var longitud = document.getElementById('longitud');
  if(nombre === "" || descripcion === "" || estado === "" || telefono === "" || latitud === "" || longitud === "")
  {
    alert("Error: Es necesario que todos los campos esten rellenados.");
  }
  else
  {
    $.ajax({
                                    type: "POST",
                                    url: "actualizarObjeto",
                                    contentType: "application/json",
                                    dataType:'json',
                                    data: JSON.stringify({ "_id" : Number(item), "nombre" : nombre.value, "descripcion" : descripcion.value, "estado" : estado.value, "telefono" : telefono.value, "latitud" : latitud.value, "longitud" : longitud.value}),
                                    success: function(data){
                                            if(data.actualizacion === "true"){
                                              //Actualización correcta (redireccionar a index)
                                              $('#actualizacionOK').modal('show');
                                              $("#botonActualizarObjeto").html("Actualizar objeto");
                                        }
                                        else {
                                            if(data.actualizacion === "error")
                                            {   
                                                //ERROR
                                                $('#actualizacionERROR').modal('show');
                                                $("#botonActualizarObjeto").html("Actualizar objeto");
                                            }
                                        }
                                        },
                                    beforeSend:function()
                                    {
                                        $("#botonActualizarObjeto").html("Actualizando...");
                                    },
                                    error: function(xhr, status, error) {
                                        console.log("Ha ocurrido un error al actualizar el objeto.");
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);
                                    },
                                    async: false
                                });
  }
}

function forzarBusqueda()
{
  $("#pac-input").trigger("place_changed");
  $("#pac-input").trigger("place_changed"); 
}

// GOOGLE MAPS

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.2633182, lng: -2.9685838},
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      $("#latitud").val(place.geometry.location.lat());
      $("#latitud").trigger('input');
      $("#longitud").val(place.geometry.location.lng());
      $("#longitud").trigger('input');

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}