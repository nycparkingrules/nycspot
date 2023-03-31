	const socket = io();

    var searching = L.icon({ iconUrl: 'icon.png', iconSize:[13,13] });
    var greenIcon = L.icon({ iconUrl: 'icon_available.png', iconSize:[13,13] });
    var redIcon   = L.icon({ iconUrl: 'icon_unavailable.png', iconSize:[13,13] });

    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000, // 1s
      timeout: 5000 // 2s
    }
     var map= "";
     var tiles ="";
     var marker, circle;
     var markers;
     var markerLocation;
	  
     var markers2 = {};
     var mymarker;	  
     	  
     setInterval(() => {	  
      navigator.geolocation.watchPosition(({coords}) => {
         lat = coords.latitude
         lon = coords.longitude
         map = L.map('map').setView([lat, lon], 18);
         tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 30, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
         }).addTo(map); 
          
       /* markers = [
           [ -75.577551,6.151813,"point1" ],
           [ -75.577948,6.151664,"point2" ],
           [ -75.578431,6.151994,"point3" ]
         ]
         
         //Loop through the markers array
         for (var i=0; i<markers.length; i++) {
            var lon = markers[i][0];
            var lat = markers[i][1];
            var popupText = markers[i][2]; 
            var markerLocation = new L.LatLng(lat, lon);
            marker = new L.Marker(markerLocation);
            map.addLayer(marker);
         
            marker.bindPopup(popupText);
         } */
        
         fun(lat, lon)
     }, console.error, options);
    }, 7000);
     
    var fun = function (la, lo) {
      function onLocationFound(e) {
          var radius = e.accuracy / 2;
	  if (marker) { // check
             map.removeLayer(marker); // remove
          }
	  if (markers) { // check
             map.removeLayer(markers);
          }

	  $.ajax({
	      url: '/getcity',
	      method : 'POST',
	      data: {"user_lat":lat, "user_lon":lon},
	      success : function(data){
	         for(var prop in data){
			   
			if (data.hasOwnProperty(prop)) {
			    cnsp  = data[prop].name;
                            lati  = data[prop].latitude;
		            longi = data[prop].longitude;
			    av    = data[prop].availability;
		            pointr = data[prop].point_reference;
			    markerLocation = new L.LatLng(lati, longi);
			    if(av == "available"){	
            		       ic = greenIcon
			    }
                            if (av == "unavailable"){ 
			       ic = redIcon
			    }
                            markers = new L.Marker(markerLocation, {icon: ic});
			    markers.bindPopup(pointr + " - " + cnsp, {autoClose: false, autoPan: false,closeOnClick: false}).openPopup();
                            map.addLayer(markers);
         		    
			}
		  }
	      }, error: function(err){console.log('Failed');} 
	  }); 
	      
	  marker = L.marker(e.latlng, {icon: searching}).addTo(map); 	 
	  marker.bindPopup('<p>You are here</p>').openPopup();
	  socket.emit('load_init_emit', e.latlng);
	 /* socket.on('load_init_on', (data) => {
		if (markers) { // check
            	   map.removeLayer(markers);
          	}
                markers = L.marker(data, {icon: searching}).addTo(map); // data corresponde a mensaje broadcasted via index.js y desde index2
                markers.bindPopup(pointr + " - " + cnsp, {autoClose: false, autoPan: false,closeOnClick: false}).openPopup();
                map.addLayer(markers);
	  }); */
	      
	  var Details = { username: 'ale', active: true, new_lat: la, new_lng: lo, update: true };
          // socket.emit('new_coords', Details);
	
        /*  for (var i=0; i<markers.length; i++) {
            var lon = markers[i][0];
            var lat = markers[i][1];
            Var av = 
            var popupText = markers[i][2];
            if()
            var markerLocation = new L.LatLng(lat, lon);
            marker = new L.Marker(markerLocation);
            map.addLayer(marker);
         
            marker.bindPopup(popupText);
          } */

      }
      map.on('locationfound', onLocationFound);

      /*socket.on('load_init', function(data) { 
           for (var i = 0; i < data.length; i++) {
              if (data[i].lat != null) {
                        markers[data[i].username] = new L.marker([data[i].lat, data[i].lng], {
                            draggable: true,
                            icon: redIcon
                        });
                        map.addLayer(markers[data[i].username]);
                        markers[data[i].username].bindPopup('Online :' + data[i].username);
                    }
           }
      }); */	   	 

            socket.on('updatecoords', function(data) {

                if (markers2[data.username]) {
                    map.removeLayer(markers2[data.username]);
                }

                markers2[data.username] = new L.marker([data.lat, data.lng], {
                    draggable: true,
                    icon: redIcon
                });
                map.addLayer(markers2[data.username]);
                markers[data.username].bindPopup(data.username + ' is on the move').openPopup();
            });

            socket.on('remove_marker', function(data) {
                map.removeLayer(markers2[data.username]);
            });	  
	       
      map.locate({setView: true, watch: true, maxZoom: 18});
    }
    
    /* socket.emit('load_init'); */
