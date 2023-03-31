var x = document.getElementById("m");
const options = {}	
navigator.geolocation.watchPosition(({coords}) => {
   lat =  coords.latitude    
   lon =  coords.longitude 
   fun(lat,lon)
}, console.error, options);
	
var fun = function(la, lo){
   $.ajax({
      url: '/getcity',
      method : 'POST',
      data: {"user_lat":la, "user_lon":lo},
      success : function(data){  
         ciudad = data;
         x.innerHTML= data;
      }, error: function(err){console.log('Failed');} 
   });
}
