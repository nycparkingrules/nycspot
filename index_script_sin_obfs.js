	function loadDoc(){ 
	    if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	    } else { 
		//x.innerHTML = "Geolocation is not supported by this browser.";
	    }
	 }
	 const socket = io();

	 var y = document.getElementById("activ");
	 function showPosition(position) { 
	   user_lat = position.coords.latitude; user_lon = position.coords.longitude;
           // Generate a number between 0 and 10, including 10
	   function generateRandomInteger(max) {
    	      return Math.floor(Math.random() * max) + 1;
           }
           let randomVal = generateRandomInteger(10000);
	   localStorage.setItem('pointReference', randomVal);	 
	   do{
	      ingresa = prompt("are you going to occupy a parking lot?, yes | no :","");
	   } while(ingresa == null || ingresa == "" );
	   if( ingresa == "yes" ){
	      /* TODO agregar un número aleatorio q identifique el punto y guardar en localstorage
	         luego se toma del localstorage en el adClick() y con un getcity2 cambiar el availability del punto en el array de puntos
	         lanzar una alerta y cambiar el color del punto y el availability a available*/	   
	      y.innerHTML = "<p>When you go to free parking this button alert near people watching for availability</p>";	   
	      do{
		 user = prompt("Add a reference about this place that helps others, for example how many time do yo ocuppy this paking","");	   
	      } while(user == null || user == "" );
	      username = user;
	      $.ajax({
	         url: '/getcity2',
	         method : 'POST',
	         data: {"user_lat":user_lat, "user_lon":user_lon, "username": username, "availability": "unavailable", "point_reference" : randomVal},
	         success : function(data){  
	           ciudad = data;
		   console.log(ciudad)     
	          }, error: function(err){console.log('Failed');} 
	      });		   
           } else {
	      //fun(user_lat,user_lon)
	      $.ajax({
	         url: '/getcity2',
	         method : 'POST',
	         data: {"user_lat":user_lat, "user_lon":user_lon, "username": "Searching Parking", "availability": "available", "point_reference" : randomVal},
	         success : function(data){  
	           ciudad = data;
		   console.log(ciudad)     
	          }, error: function(err){console.log('Failed');} 
	      });	
	   }
	   	 
	 }
	
	function addClick(){
            pointReference = localStorage.getItem('pointReference');	
	    $.ajax({
	         url: '/getcity3',
	         method : 'POST',
	         data: {"user_lat":user_lat, "user_lon":user_lon, "username": username, "availability": "available", "point_reference" : pointReference},
	         success : function(data){  
	           ciudad = data;
		   console.log(ciudad)     
	          }, error: function(err){console.log('Failed');} 
	      });	
	}
				
  /*var x = document.getElementById("m");
  const options = {}	
  navigator.geolocation.watchPosition(({coords}) => {
    lat =  coords.latitude    
    lon =  coords.longitude 
    fun(lat,lon)
  }, console.error, options);
 
  users = [];
  var fun = function(la, lo){
    $.ajax({
      url: '/getcity',
      method : 'POST',
      data: {"user_lat":la, "user_lon":lo},
      success : function(data){  
	    for(var prop in data){
		if (data.hasOwnProperty(prop)) {
		    cnsp = data[prop].name;
                    //x.innerHTML= cnsp;
		    //url = "https:\/\/ubicar.herokuapp.com\/"+nsp_user+"?q=_"+nsp_user+"_"+ciudad_lat+"_"+ciudad_lon+"_asd@asdsd.co_"+cnsp;
		    url = "https:\/\/ubicar.herokuapp.com\/"+cnsp;
		    if(!users){ 
			users.push(url);
		    } else {  
			n = users.includes(url);
			if(n){ 
			 //
			}else{
			  users.push(url);
			  $("ul#theList").append('<li style="border-top: 1px solid #cdcdcd; padding: 12px;  background: #e8e9f2"><a href="'+url+'" class="pop" >'+
		          cnsp +'</a></li>'); 	
		        }
		    } 
		    console.log(users)
		}
	    }
      }, error: function(err){console.log('Failed');} 
    });
  } */
