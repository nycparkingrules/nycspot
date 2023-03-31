var trmcol  = require("trmcol");
var express = require("express");
var app     = express();
var server  = require('http').Server(app);
const socketIO = require('socket.io')(server);
var axios = require('axios');
const fetch = require('node-fetch');
const port = 8888;

var active = false;
var update = false;
var users = [];

var t = "";
function asignartrm(val) { t = val; } // asigna a t el valor trm.value desde el servicio npm de la tasa representativa
//var today = new Date().toISOString().slice(0, 10); // 2020-10-22
var today = new Date().toISOString().slice(0, 16);   // 2020-10-22T21:00
console.log(today);
trmcol.query(today).then((trm) => asignartrm(trm.value)).catch((err) => console.log(err)); // pasa al servicio la fecha de hoy y devuelve trm.value
app.get("/trm/:name?", (req, res) =>
  res.append("Access-Control-Allow-Origin", "*").json({ value: `Agosto 2020  |  DTF: 3.29%  |  UVR: $ 275  |  TRM Hoy ${today} : $ ${t}` })
  //  res.append("Access-Control-Allow-Origin", "*").json({ value: `Fecha ${today}` })
);

class CircularGeofenceRegion {
	  constructor(opts) {
	    Object.assign(this, opts)
	  }
	  inside(lat2, lon2) {
	    const lat1 = this.latitude
	    const lon1 = this.longitude
	    const R = 6371000; // Earth's radius in m
	    return Math.acos(Math.sin(lat1)*Math.sin(lat2) + 
			     Math.cos(lat1)*Math.cos(lat2) *
			     Math.cos(lon2-(lon1))) < 0.02
	  }
};

class SquareGeofenceRegion {
	  constructor(opts) {
	    Object.assign(this, opts)
	  }
	  inside(lat, lon) {
	    const x = this.latitude
	    const y = this.longitude
	    const { axis } = this
	    return lat > (x - 0.02) && 
		   lat < (x + 0.02) &&
		   lon > (y - 0.02) &&
		   lon < (y + 0.02)
	  }
}; 

const object_coord = [		  
	{name: 'casa', longitude:-75.5782741, latitude: 6.1522974, availability: 'available', point_reference : ''}, 	
	{name: 'San Jose', latitude: 6.162053, longitude: -75.582463, availability: 'unavailable', point_reference : ''},
	{name: 'estacion envigado', latitude: 6.174544, longitude:-75.595615, availability: 'unavailable', point_reference : '' },
	{name: 'Punto clave',  longitude:-75.4438209, latitude: 6.0962976, availability: 'available', point_reference : '' },
	
	{name: 'point1',longitude:-75.577551,latitude:6.151813, availability: 'unavailable', point_reference : '' },
        {name: 'point2',longitude:-75.577948,latitude:6.151664, availability: 'available', point_reference : '' },    
        {name: 'point3',longitude:-75.578431,latitude:6.151994, availability: 'unavailable', point_reference : '' },   
] 


const bodyParser = require("body-parser");  // load postman json username and passw  $ npm install body-parser      	
app.use(bodyParser.urlencoded({extended: false})); // necesario para pasar data de jquery post
app.post("/getcity", (req, res) => {
           lat =  req.body.user_lat   
	   lon =  req.body.user_lon
	   const fences = []
	   const sector = []
	   for ( const property of object_coord) {
	      fenceA = new CircularGeofenceRegion(property);			
	      fenceB = new SquareGeofenceRegion(property);
	      fences.push(fenceA)
	      fences.push(fenceB)	 
	   } // fín for
	   for ( const fenc of fences) {
	      // hacer un array que recoja los puntos del sector de la buena mesa y pasarlo al front  		   
	      if (fenc.inside(lat, lon)) {
	         //audio2.play();
	         //setTimeout(myFunction, 2100)
		 sector.push(fenc)                       
  		 //break;
	      }	      
           } 
	res.status(200).send(sector);
});

app.post("/getcity2", (req, res) => { // agrega el nuevo punto al array object_coord
           lat  = req.body.user_lat   
	   lon  = req.body.user_lon
	   user = req.body.username
	   av   = req.body.availability
	   pointref = req.body.point_reference
	   const obj = {name: user, longitude:lon, latitude:lat, availability: av, point_reference: pointref};
	   object_coord.push(obj);
	   res.status(200).send(object_coord);
});

app.post("/getcity3", (req, res) => { // actualiza availability del punto cuando se libera el parqueadero en object_coord
           lat  = req.body.user_lat   
	   lon  = req.body.user_lon
	   user = req.body.username
	   av   = req.body.availability
	   pointref = req.body.point_reference
	   for (var i=0; i<object_coord.length; i++) {   
	      pr = object_coord[i]["point_reference"];   av ="available";
              if( pr ==  pointref){
                 object_coord[i]["availability"] = av
	      }
           }
	   res.status(200).send(object_coord);
});

app.get('/estilos.css', function (req, res) {
  res.sendFile(__dirname + '/estilos.css');
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/index2', function (req, res) {
  res.sendFile(__dirname + '/index2.html');	
});
app.get('/icon.png', function (req, res) {
  res.sendFile(__dirname + '/icon.png');
});
app.get('/icon_available.png', function (req, res) {
  res.sendFile(__dirname + '/icon_available.png');
});
app.get('/icon_unavailable.png', function (req, res) {
  res.sendFile(__dirname + '/icon_unavailable.png');
});
app.get('/redIcon.png', function (req, res) {
  res.sendFile(__dirname + '/redIcon.png');
});
app.get('/script.js', function (req, res) {
  res.sendFile(__dirname + '/script.js');
});
app.get('/script2.js', function (req, res) {
  res.sendFile(__dirname + '/script2.js');
});
app.get('/opencurb.html', function (req, res) {
  res.sendFile(__dirname + '/opencurb.html');
});
app.get('/sample-geojson.js', function (req, res) {
  res.sendFile(__dirname + '/sample-geojson.js');
});


//The socket.io("connection") the function above creates a connection with the web client.
//Socket.io creates a unique ID for each client and logs the ID to the console whenever a user 
//visits the web page. When you refresh or close the web page, the socket fires the disconnect event showing that a user has disconnected from the socket.
//Next, update the function to send and receive data from the client.
//*socket.broadcast.emit() - sends the data to everyone except you, and the socket.emit() - sends the data to everyone connected to the server, including you*

socketIO.on('connection', (socket) => {
	
  console.log(`⚡: ${socket.id} user just connected`);
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
	
  socket.on('message', (data) => {
        //sends the data to everyone except you.
    socket.broadcast.emit('response', data);  // emite al response on de script2.js 
        //sends the data to everyone connected to the server
    // socket.emit("response", data)
  }); 
	
  socket.on('load_init_emit', (data) => {
        socket.broadcast.emit('load_init_on', data);
	// enviar con CDN null-point-sys axios-get-post.js la data a api de camarasdefotodetección.com
	// recibir acá para gstionar tiempo real  
	// recibir en endpoint GET y en respuesta enviar nuevamente la actualización
	// aquí recibir en un api GET y enviar al cliente
  })	
	
  /*var addedUser = false;
    socket.on('add user', (username) => {
        if (addedUser) return;
        socket.username = username;
        var new_count = users.length;
        console.log(new_count);
        var new_user = { username: username, active: active, lat: null, lng: null, update: false };
        users.push(new_user);
        console.log(users);
    }); */
	
   socket.on('new_coords', (data) => {
        var New_Details = { username: data.username, active: data.active, lat: data.new_lat, lng: data.new_lng, update: true };
        var checkuser = data.username;
        result = users.map(obj => obj.username).indexOf(checkuser) >= 0;
        if (result === true) {
            objIndex = users.findIndex((obj => obj.username == data.username));
            users[objIndex].lat = data.new_lat;
            users[objIndex].lng = data.new_lng;
            users[objIndex].active = data.active;
            users[objIndex].update = true;
            var to_send = { username: data.username, active: true, lat: data.new_lat, lng: data.new_lng, update: true };
            console.log(data.username + ' has just updated their location');
            var new_count = users.length;
            console.log(new_count);
            console.log(users);
            socket.broadcast.emit('updatecoords', to_send);
            objIndex = users.findIndex((obj => obj.username == data.username));
            users[objIndex].update = false;
        }
    });
    socket.on('load_init', (data) => { socket.emit('load_init', users); })	
	
});

server.listen(process.env.PORT || port, () =>  console.log(`Listening on ${server.address().port}`) );
